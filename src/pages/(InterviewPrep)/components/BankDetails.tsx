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
  const [bankId, setBankId] = useState<number | null>(null);
  const [fetching, setFetching] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const initialBankRef = useRef<any>(null);
  const initialFormRef = useRef<any>(null);
  const [extraBankIds, setExtraBankIds] = useState<number[]>([]);
  const [uploading, setUploading] = useState(false);
  const [cloudDeleteToken, setCloudDeleteToken] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          const first = resp[0];
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
            item = (detailed && (detailed.data || detailed)) || first;
            if (primaryId) setBankId(Number(primaryId));
          } else {
            item = first;
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
          accountType: item.account_type ? (item.account_type.includes("Savings") ? 'savings' : item.account_type.includes("Current") ? 'current' : item.account_type) : "",
          documentUrl: item.document_url || "",
        };

        setFormData((prev: any) => ({ ...prev, ...mapped }));
        // store initial mapped form snapshot for dirty checking
        initialFormRef.current = mapped;
        // ensure expanded when data arrives
        setIsExpanded(true);
      } catch (err) {
        console.error("Error fetching bank details:", err);
      } finally {
        setFetching(false);
      }
    };

    fetchDetails();
    // re-run when refreshKey changes so parent can force a re-fetch
  }, [refreshKey]);

  const bankLabels: Record<string, string> = {
    sbi: "SBI",
    hdfc: "HDFC Bank",
    icici: "ICICI Bank",
    axis: "Axis Bank",
  };

  const handleConfirm = async (skipNext: boolean = false) => {
    setError(null);
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
      account_type: formData.accountType === "savings" ? "Savings Account" : formData.accountType === "current" ? "Current Account" : formData.accountType,
      branch_name: formData.branchName,
      document_url: formData.documentUrl || "",
    };

    try {
      setLoading(true);
      if (bankId) {
        await updateBankDetails(userId, token, bankId, payload);
      } else {
        await saveBankDetails(userId, token, payload);
      }
      setLoading(false);
      if (!skipNext) onNext();
    } catch (err) {
      console.error("Failed to save bank details:", err);
      setLoading(false);
      setError("Failed to save bank details. Please try again.");
    }
  };

  const fieldsToCheck = [
    'accountHolderName',
    'bankName',
    'branchName',
    'accountNumber',
    'confirmAccountNumber',
    'ifscCode',
    'accountType',
    'documentUrl',
  ];

  const hasChanges = useMemo(() => {
    const init = initialFormRef.current || {};
    if (!bankId) {
      // new: if any field has value
      return fieldsToCheck.some((f) => !!(formData[f] || ""));
    }
    return fieldsToCheck.some((f) => ('' + (formData[f] || '')) !== ('' + (init[f] || '')));
  }, [formData, bankId, refreshKey]);

  const handleReset = () => {
    const item = initialBankRef.current;
    if (!item) return;
    setFormData((prev: any) => ({
      ...prev,
      accountHolderName: item.account_holder_name || "",
      bankName: Object.keys(bankLabels).find(k => bankLabels[k] === (item.bank_name || "")) || item.bank_name || "",
      branchName: item.branch_name || "",
      accountNumber: item.account_number || "",
      confirmAccountNumber: item.account_number || "",
      ifscCode: item.ifsc_code || "",
      accountType: item.account_type ? (item.account_type.includes("Savings") ? 'savings' : item.account_type.includes("Current") ? 'current' : item.account_type) : "",
      documentUrl: item.document_url || prev.documentUrl || "",
    }));
  };

  const handleDelete = async () => {
    setError(null);
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
                title="Save"
                onClick={() => handleConfirm(true)}
                className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-green-500 hover:bg-green-50"
              >
                <Save className="w-4 h-4 text-green-600" />
              </button>
            )}
            <button
              type="button"
              title="Collapse/Expand"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-gray-300 hover:bg-gray-100"
            >
              <ChevronDown className={`w-4 h-4 text-gray-600 ${!isExpanded ? 'rotate-180' : ''}`} />
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
              className="w-8 h-8 flex items-center justify-center rounded-full border-2 border-red-500 hover:bg-red-50"
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
                  <option value="sbi">State Bank of India</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="axis">Axis Bank</option>
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
              <label className="block text-sm font-medium text-[#3A3A3A] mb-2">Cancelled Cheque / Bank Statement</label>
              <div className="border border-gray-200 rounded-md p-4">
                {formData.documentUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={formData.documentUrl} alt="document" className="h-24 object-contain rounded-md" />
                      <div className="text-sm text-gray-600 break-all max-w-xs">{formData.documentUrl}</div>
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
                    <div className="text-sm text-gray-500">Upload an image of cancelled cheque / bank statement</div>
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

        {/* (duplicate block removed) */}

        {/* Buttons */}
        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex justify-end mt-6 space-x-4">
          <button
            onClick={onPrevious}
            className="px-6 py-2.5 rounded-md border-2 border-[#FF8351] text-[#FF8351] font-semibold hover:bg-[#FFF5F0] transition-colors"
          >
            Previous
          </button>
          <button
            onClick={onNext}
            className="px-6 py-2.5 rounded-md text-white font-semibold transition-transform hover:scale-105"
            style={{
              background: "linear-gradient(180deg, #FF9D48 0%, #FF8251 100%)",
            }}
          >
            Confirm Details
        </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetails;
