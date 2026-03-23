import React, { useState, useEffect, useRef, useMemo } from "react";
import { Save, ChevronDown, RotateCcw, Trash2 } from "lucide-react";
import { saveBankDetails, getBankDetails, getBankDetailById, updateBankDetails, deleteBankDetails } from "@/services/bankService";
import { uploadToCloudinary } from "@/utils/uploadToCloudinary";
import { deleteFromCloudinary } from "@/utils/deleteFromCloudinary";

interface BankDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  refreshKey?: number;
}

const BankDetails = ({
  formData,
  setFormData,
  onNext,
  onPrevious,
  refreshKey,
}: BankDetailsProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [bankId, setBankId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showUnsavedPopup, setShowUnsavedPopup] = useState(false);

  // FIX 2: use state instead of ref so hasChanges memo re-runs after save
  const [initialForm, setInitialForm] = useState<any>(null);

  const initialBankRef = useRef<any>(null);
  const [extraBankIds, setExtraBankIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [cloudDeleteToken, setCloudDeleteToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const bankLabels: Record<string, string> = {
    // National Banks
    sbi: "State Bank of India",
    bob: "Bank of Baroda",
    pnb: "Punjab National Bank",
    canara: "Canara Bank",
    ubi: "Union Bank of India",
    indianbank: "Indian Bank",
    boi: "Bank of India",
    cbi: "Central Bank of India",
    iob: "Indian Overseas Bank",
    uco: "UCO Bank",
    bom: "Bank of Maharashtra",
    psb: "Punjab & Sind Bank",
    // Private Sector Banks
    hdfc: "HDFC Bank",
    icici: "ICICI Bank",
    axis: "Axis Bank",
    kotak: "Kotak Mahindra Bank",
    indusind: "IndusInd Bank",
    yesbank: "Yes Bank",
    idfc: "IDFC FIRST Bank",
    bandhan: "Bandhan Bank",
    csb: "CSB Bank",
    cub: "City Union Bank",
    dcb: "DCB Bank",
    dhanlaxmi: "Dhanlaxmi Bank",
    fed: "Federal Bank",
    jkbank: "Jammu & Kashmir Bank",
    karnataka: "Karnataka Bank",
    kvb: "Karur Vysya Bank",
    nainital: "Nainital Bank",
    rbl: "RBL Bank",
    sib: "South Indian Bank",
    tmb: "Tamilnad Mercantile Bank",
    // Payments Banks
    airtel: "Airtel Payments Bank",
    ipb: "India Post Payments Bank",
    paytm: "Paytm Payments Bank",
    fino: "Fino Payments Bank",
    jio: "Jio Payments Bank",
    nsdl: "NSDL Payments Bank",
    // Small Finance Banks
    au: "AU Small Finance Bank",
    equitas: "Equitas Small Finance Bank",
    ujjivan: "Ujjivan Small Finance Bank",
    esaf: "ESAF Small Finance Bank",
    jana: "Jana Small Finance Bank",
    suryoday: "Suryoday Small Finance Bank",
    utkarsh: "Utkarsh Small Finance Bank",
    capital: "Capital Small Finance Bank",
    nesb: "North East Small Finance Bank",
    unity: "Unity Small Finance Bank",
    shivalik: "Shivalik Small Finance Bank",
    // Foreign Banks
    hsbc: "HSBC Bank India",
    citi: "Citibank India",
    sc: "Standard Chartered Bank",
    deutsche: "Deutsche Bank India",
    barclays: "Barclays Bank India",
    bnp: "BNP Paribas India",
    bofa: "Bank of America India",
    jpm: "JP Morgan Chase Bank India",
    ca: "Credit Agricole Bank India",
    dbs: "DBS Bank India",
    mizuho: "Mizuho Bank India",
    mufg: "MUFG Bank India",
    rabo: "Rabobank India",
    sbical: "SBI California",
    ubs: "UBS Bank India",
  };

  // Fetch when component mounts or when parent requests a refresh via `refreshKey`
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const parsed = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = parsed?.user_id;
        const token = parsed?.token;
        if (!userId || !token) return;
        setFetching(true);
        const resp = await getBankDetails(userId, token);
        console.debug("bankService.getBankDetails response:", resp);
        if (!resp) {
          setFetching(false);
          return;
        }
        let item: any = null;
        // If API returned an array/list, pick first and then GET by id
        if (Array.isArray(resp)) {
          if (resp.length === 0) {
            setFetching(false);
            return;
          }
          const ids: number[] = [];
          resp.forEach((r: any) => {
            const bid = r.bank_id || r.id || r._id || null;
            if (bid) ids.push(Number(bid));
          });
          const primaryId = ids.length > 0 ? ids[0] : null;
          const extras = ids.slice(1);
          if (extras.length > 0) setExtraBankIds(extras);
          if (primaryId) {
            console.debug("found bank id from list, fetching by id:", primaryId);
            const detailed = await getBankDetailById(userId, token, primaryId);
            console.debug("bankService.getBankDetailById response:", detailed);
            item = (detailed && (detailed.data || detailed)) || resp[0];
            if (primaryId) setBankId(Number(primaryId));
          } else {
            item = resp[0];
          }
        } else if (resp && typeof resp === "object") {
          // Could be a single object or wrapped response
          const maybe = resp.data || resp;
          const id = maybe.bank_id || maybe.id || maybe._id || null;
          if (id) {
            console.debug("found bank id in response, fetching by id:", id);
            const detailed = await getBankDetailById(userId, token, id);
            console.debug("bankService.getBankDetailById response:", detailed);
            item = (detailed && (detailed.data || detailed)) || maybe;
            if (id) setBankId(Number(id));
          } else {
            item = maybe;
          }
        }
        if (!item) {
          console.debug("no bank item found in response");
          setFetching(false);
          return;
        }
        // store initial fetched data for reset
        initialBankRef.current = item;
        const id = item.bank_id || item.id || item._id || null;
        if (id) setBankId(Number(id));
        console.debug("mapped bank id:", id, "mapped item:", item);
        // Map API response to formData shape used by this component
        const mapped = {
          accountHolderName: item.account_holder_name || "",
          bankName: Object.keys(bankLabels).find(k => bankLabels[k] === (item.bank_name || "")) || item.bank_name || "",
          branchName: item.branch_name || "",
          accountNumber: item.account_number || "",
          confirmAccountNumber: item.account_number || "",
          ifscCode: item.ifsc_code || "",
          accountType: item.account_type
            ? item.account_type.includes("Savings")
              ? "savings"
              : item.account_type.includes("Current")
              ? "current"
              : item.account_type
            : "",
          documentUrl: item.document_url || "",
        };
        setFormData((prev: any) => ({ ...prev, ...mapped }));
        // FIX 2: store initial mapped form snapshot as state for dirty checking
        setInitialForm(mapped);
        // ensure expanded when data arrives
        setIsExpanded(true);
      } catch (err) {
        console.error("Error fetching bank details:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchDetails();
  }, [refreshKey]);

  const handleConfirm = async (skipNext: boolean = false) => {
    setError(null);
    setSuccess(null);
    // basic validation
    if (!formData.accountHolderName) return setError("Account holder name is required");
    if (!formData.bankName) return setError("Bank name is required");
    if (!formData.branchName) return setError("Branch name is required");
    if (!formData.accountNumber) return setError("Account number is required");
    if (formData.accountNumber !== formData.confirmAccountNumber) return setError("Account numbers do not match");
    if (!formData.ifscCode) return setError("IFSC code is required");
    if (!formData.accountType) return setError("Account type is required");
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = parsed?.user_id;
    const token = parsed?.token;
    if (!userId || !token) return setError("User not authenticated");
    const payload = {
      bank_name: bankLabels[formData.bankName] || formData.bankName,
      account_holder_name: formData.accountHolderName,
      account_number: formData.accountNumber,
      ifsc_code: formData.ifscCode,
      account_type:
        formData.accountType === "savings"
          ? "Savings Account"
          : formData.accountType === "current"
          ? "Current Account"
          : formData.accountType,
      branch_name: formData.branchName,
      document_url: formData.documentUrl || "",
    };
    try {
      setLoading(true);
      if (bankId) {
        // Existing record → PUT/PATCH
        await updateBankDetails(userId, token, bankId, payload);
      } else {
        // New record → POST
        const result = await saveBankDetails(userId, token, payload);
        // FIX 1: capture returned id so subsequent saves use PUT instead of POST
        const newId =
          result?.bank_id ||
          result?.data?.bank_id ||
          result?.id ||
          result?.data?.id ||
          null;
        if (newId) setBankId(Number(newId));
      }
      setLoading(false);
      // FIX 2: update initialForm state so hasChanges becomes false → Save button disappears
      setInitialForm({ ...formData });
      setSuccess("Bank details saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
      if (!skipNext) onNext();
    } catch (err) {
      console.error("Failed to save bank details:", err);
      setLoading(false);
      setError("Failed to save bank details. Please try again.");
    }
  };

  const fieldsToCheck = [
    "accountHolderName",
    "bankName",
    "branchName",
    "accountNumber",
    "confirmAccountNumber",
    "ifscCode",
    "accountType",
    "documentUrl",
  ];

  // FIX 2: depend on initialForm (state) instead of a ref so memo re-runs correctly
  const hasChanges = useMemo(() => {
    const init = initialForm || {};
    if (!bankId) {
      // new record: show Save if any field has a value
      return fieldsToCheck.some((f) => !!(formData[f] || ""));
    }
    return fieldsToCheck.some(
      (f) => ("" + (formData[f] || "")) !== ("" + (init[f] || ""))
    );
  }, [formData, bankId, initialForm]);

  const handleReset = () => {
    const item = initialBankRef.current;
    if (!item) return;
    setFormData((prev: any) => ({
      ...prev,
      accountHolderName: item.account_holder_name || "",
      bankName:
        Object.keys(bankLabels).find(k => bankLabels[k] === (item.bank_name || "")) ||
        item.bank_name ||
        "",
      branchName: item.branch_name || "",
      accountNumber: item.account_number || "",
      confirmAccountNumber: item.account_number || "",
      ifscCode: item.ifsc_code || "",
      accountType: item.account_type
        ? item.account_type.includes("Savings")
          ? "savings"
          : item.account_type.includes("Current")
          ? "current"
          : item.account_type
        : "",
      documentUrl: item.document_url || prev.documentUrl || "",
    }));
  };

  const handleDelete = async () => {
    setError(null);
    setSuccess(null);
    if (!bankId) return setError("No bank detail to delete.");
    const parsed = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = parsed?.user_id;
    const token = parsed?.token;
    if (!userId || !token) return setError("User not authenticated");
    try {
      setLoading(true);
      await deleteBankDetails(userId, token, bankId);
      setLoading(false);
      setBankId(null);
      setInitialForm(null);
      // clear form values
      setFormData((prev: any) => ({
        ...prev,
        accountHolderName: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
        confirmAccountNumber: "",
        ifscCode: "",
        accountType: "",
        documentUrl: "",
      }));
      setSuccess("Bank details cleared successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Failed to delete bank details:", err);
      setLoading(false);
      setError("Failed to delete bank details. Please try again.");
    }
  };

  return (
    <div className="bg-white rounded-md p-6">
      <div className="space-y-4">
        {/* Card Header with action icons */}
        <div className="flex items-center justify-between px-2 py-1">
          <h3 className="text-lg font-semibold text-gray-900">Bank Details</h3>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <button
                type="button"
                onClick={() => handleConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 text-white rounded-md text-sm font-medium shadow-sm hover:from-orange-500 hover:to-orange-600 transition cursor-pointer"
                aria-pressed="false"
                aria-label="Save bank detail changes"
              >
                <Save className="w-4 h-4" strokeWidth={2} />
                Save
              </button>
            )}
            <button
              type="button"
              title="Collapse/Expand"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100"
            >
              <ChevronDown className={`w-4 h-4 text-gray-600 ${!isExpanded ? "rotate-180" : ""}`} />
            </button>
            <button
              type="button"
              title="Reset"
              onClick={handleReset}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100"
            >
              <RotateCcw className="w-4 h-4 text-gray-600" />
            </button>
            <button
              type="button"
              title="Delete"
              onClick={handleDelete}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-500 hover:bg-red-50 hover:cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        </div>

        {fetching && (
          <div className="text-sm text-gray-500">Loading bank details...</div>
        )}

        {isExpanded && (
          <>
            <div>
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                Account Holder Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.accountHolderName || ""}
                onChange={(e) =>
                  setFormData({ ...formData, accountHolderName: e.target.value })
                }
                placeholder="Enter Account Holder Name"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
              />
            </div>

            {/* Bank Name + Branch Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Bank Name <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.bankName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                >
                  <option value="">Select Bank Name</option>
                  <optgroup label="National Banks">
                    <option value="sbi">State Bank of India</option>
                    <option value="bob">Bank of Baroda</option>
                    <option value="pnb">Punjab National Bank</option>
                    <option value="canara">Canara Bank</option>
                    <option value="ubi">Union Bank of India</option>
                    <option value="indianbank">Indian Bank</option>
                    <option value="boi">Bank of India</option>
                    <option value="cbi">Central Bank of India</option>
                    <option value="iob">Indian Overseas Bank</option>
                    <option value="uco">UCO Bank</option>
                    <option value="bom">Bank of Maharashtra</option>
                    <option value="psb">Punjab & Sind Bank</option>
                  </optgroup>
                  <optgroup label="Private Sector Banks">
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="kotak">Kotak Mahindra Bank</option>
                    <option value="indusind">IndusInd Bank</option>
                    <option value="yesbank">Yes Bank</option>
                    <option value="idfc">IDFC FIRST Bank</option>
                    <option value="bandhan">Bandhan Bank</option>
                    <option value="csb">CSB Bank</option>
                    <option value="cub">City Union Bank</option>
                    <option value="dcb">DCB Bank</option>
                    <option value="dhanlaxmi">Dhanlaxmi Bank</option>
                    <option value="fed">Federal Bank</option>
                    <option value="jkbank">Jammu & Kashmir Bank</option>
                    <option value="karnataka">Karnataka Bank</option>
                    <option value="kvb">Karur Vysya Bank</option>
                    <option value="nainital">Nainital Bank</option>
                    <option value="rbl">RBL Bank</option>
                    <option value="sib">South Indian Bank</option>
                    <option value="tmb">Tamilnad Mercantile Bank</option>
                  </optgroup>
                  <optgroup label="Payments Banks">
                    <option value="airtel">Airtel Payments Bank</option>
                    <option value="ipb">India Post Payments Bank</option>
                    <option value="paytm">Paytm Payments Bank</option>
                    <option value="fino">Fino Payments Bank</option>
                    <option value="jio">Jio Payments Bank</option>
                    <option value="nsdl">NSDL Payments Bank</option>
                  </optgroup>
                  <optgroup label="Small Finance Banks">
                    <option value="au">AU Small Finance Bank</option>
                    <option value="equitas">Equitas Small Finance Bank</option>
                    <option value="ujjivan">Ujjivan Small Finance Bank</option>
                    <option value="esaf">ESAF Small Finance Bank</option>
                    <option value="jana">Jana Small Finance Bank</option>
                    <option value="suryoday">Suryoday Small Finance Bank</option>
                    <option value="utkarsh">Utkarsh Small Finance Bank</option>
                    <option value="capital">Capital Small Finance Bank</option>
                    <option value="nesb">North East Small Finance Bank</option>
                    <option value="unity">Unity Small Finance Bank</option>
                    <option value="shivalik">Shivalik Small Finance Bank</option>
                  </optgroup>
                  <optgroup label="Foreign Banks">
                    <option value="hsbc">HSBC Bank India</option>
                    <option value="citi">Citibank India</option>
                    <option value="sc">Standard Chartered Bank</option>
                    <option value="deutsche">Deutsche Bank India</option>
                    <option value="barclays">Barclays Bank India</option>
                    <option value="bnp">BNP Paribas India</option>
                    <option value="bofa">Bank of America India</option>
                    <option value="jpm">JP Morgan Chase Bank India</option>
                    <option value="ca">Credit Agricole Bank India</option>
                    <option value="dbs">DBS Bank India</option>
                    <option value="mizuho">Mizuho Bank India</option>
                    <option value="mufg">MUFG Bank India</option>
                    <option value="rabo">Rabobank India</option>
                    <option value="sbical">SBI California</option>
                    <option value="ubs">UBS Bank India</option>
                  </optgroup>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Branch Name <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.branchName || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, branchName: e.target.value })
                  }
                  placeholder="Enter Branch Name"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                />
              </div>
            </div>

            {/* Account number + confirm */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.accountNumber || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                  placeholder="Enter Bank Account Number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Confirm Account Number <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.confirmAccountNumber || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmAccountNumber: e.target.value,
                    })
                  }
                  placeholder="Confirm Bank Account Number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                />
              </div>
            </div>

            {/* IFSC + Account Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  IFSC Code <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.ifscCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, ifscCode: e.target.value })
                  }
                  placeholder="Enter Bank IFSC Code"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.accountType || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, accountType: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FF8351] focus:border-transparent"
                >
                  <option value="">Select Account Type</option>
                  <option value="savings">Savings Account</option>
                  <option value="current">Current Account</option>
                </select>
              </div>
            </div>

            {/* Document upload (cancelled cheque / bank statement) */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">
                Cancelled Cheque / Bank Statement
              </label>
              <div className="border border-gray-200 rounded-md p-4">
                {formData.documentUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img
                        src={formData.documentUrl}
                        alt="document"
                        className="h-24 object-contain rounded-md"
                      />
                      <div className="text-sm text-gray-600 break-all max-w-xs">
                        {formData.documentUrl}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        title="Remove document"
                        onClick={async () => {
                          setError(null);
                          try {
                            if (cloudDeleteToken) {
                              await deleteFromCloudinary(cloudDeleteToken);
                            }
                          } catch (err) {
                            console.error("Failed to delete from cloudinary:", err);
                          }
                          setCloudDeleteToken(null);
                          setFormData((prev: any) => ({ ...prev, documentUrl: "" }));
                        }}
                        className="px-3 py-2 rounded-md border border-gray-300 text-sm text-red-500 bg-white hover:bg-red-50"
                      >
                        X
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="text-sm text-gray-500">
                      Upload an image of cancelled cheque / bank statement
                    </div>
                    <div className="flex items-center">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={async (e) => {
                          setError(null);
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setUploading(true);
                          try {
                            const res = await uploadToCloudinary(file);
                            if (res && res.url) {
                              setFormData((prev: any) => ({ ...prev, documentUrl: res.url }));
                              setCloudDeleteToken(res.deleteToken || null);
                            }
                          } catch (err) {
                            console.error("Upload failed:", err);
                            setError("Upload failed. Please try again.");
                          } finally {
                            setUploading(false);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-md bg-white border border-gray-300 text-sm text-[#FF8351] hover:bg-[#FFF5F0]"
                      >
                        {uploading ? "Uploading..." : "Upload"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* Feedback messages */}
        {error && <div className="text-sm text-red-600">{error}</div>}
        {success && <div className="text-sm text-green-600">{success}</div>}

        {/* Buttons */}
        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onPrevious}
            className="px-6 py-2.5 rounded-md border-2 border-[#FF8351] text-[#FF8351] font-semibold hover:bg-[#FFF5F0] transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => {
              if (hasChanges) {
                setShowUnsavedPopup(true);
              } else {
                onNext();
              }
            }}
            className="px-6 py-2.5 rounded-md text-white font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
          >
            Confirm Details
          </button>
        </div>

        {/* Unsaved Changes Popup */}
        {showUnsavedPopup && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div
              className="absolute inset-0 backdrop-blur-md bg-white/10"
              onClick={() => setShowUnsavedPopup(false)}
            ></div>
            <div className="relative bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md z-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Unsaved Changes
              </h3>
              <p className="text-sm text-gray-700 mb-6">
                You have unsaved changes. Please save your bank details before
                proceeding to the next step.
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUnsavedPopup(false)}
                  className="px-4 py-2 rounded-md text-white font-medium"
                  style={{
                    background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BankDetails;