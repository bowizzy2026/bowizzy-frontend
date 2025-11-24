import React from "react";
import type { ResumeData } from "@/types/resume";

interface ModernProfessionalTemplateProps {
  data: ResumeData;
}

export const ModernProfessionalTemplate: React.FC<
  ModernProfessionalTemplateProps
> = ({ data }) => {
  // Helper functions
  const fullName = [
    data.personal.firstName,
    data.personal.middleName,
    data.personal.lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .toUpperCase();

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.getFullYear().toString();
  };

  const formatMonthYear = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  // Build address from available fields
  const buildAddress = () => {
    const parts = [];
    if (data.personal.address) parts.push(data.personal.address);
    if (data.personal.city) parts.push(data.personal.city);
    if (data.personal.state) parts.push(data.personal.state);
    if (data.personal.pincode) parts.push(data.personal.pincode);
    return parts.join(", ");
  };

  const address = buildAddress();

  // Get job title from experience or career objective
  const getJobTitle = () => {
    if (data.experience.jobRole) return data.experience.jobRole;
    if (data.experience.workExperiences?.[0]?.jobTitle)
      return data.experience.workExperiences[0].jobTitle;
    return "";
  };

  return (
    <div className="w-[210mm] min-h-[297mm] bg-white flex text-gray-800 relative page-break-after">
      {/* Left Column - Beige Background */}
      <div className="w-[35%] bg-[#F5E6D3] p-6 flex flex-col space-y-6">
        {/* Contact Section */}
        {(address || data.personal.email || data.personal.mobileNumber) && (
          <div className="page-break-inside-avoid">
            <h3 className="text-sm font-bold mb-3 text-gray-900">Contact</h3>
            <div className="space-y-2 text-xs text-gray-700">
              {address && (
                <p className="leading-relaxed break-words">{address}</p>
              )}
              {data.personal.email && (
                <p className="leading-relaxed break-words">
                  {data.personal.email}
                </p>
              )}
              {data.personal.mobileNumber && (
                <p>{data.personal.mobileNumber}</p>
              )}
            </div>
          </div>
        )}

        {/* About Me / Career Objective Section */}
        {data.personal.aboutCareerObjective && (
          <div className="page-break-inside-avoid">
            <h3 className="text-sm font-bold mb-3 text-gray-900">About Me</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              {data.personal.aboutCareerObjective}
            </p>
          </div>
        )}

        {/* Skills Section */}
        {data.skillsLinks.skills &&
          data.skillsLinks.skills.some(
            (s) => s.enabled && s.skillName.trim()
          ) && (
            <div className="page-break-inside-avoid">
              <h3 className="text-sm font-bold mb-3 text-gray-900">Skills</h3>
              <div className="space-y-1.5">
                {data.skillsLinks.skills
                  .filter((s) => s.enabled)
                  .map((skill, idx) => (
                    <div
                      key={idx}
                      className="text-xs text-gray-700 flex justify-between items-center"
                    >
                      <span>{skill.skillName}</span>
                      {skill.skillLevel && (
                        <span className="text-[10px] text-gray-500">
                          {skill.skillLevel}
                        </span>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Languages Section */}
        {data.personal.languagesKnown &&
          data.personal.languagesKnown.length > 0 && (
            <div className="page-break-inside-avoid">
              <h3 className="text-sm font-bold mb-3 text-gray-900">
                Languages
              </h3>
              <div className="space-y-1.5">
                {data.personal.languagesKnown.map((lang, idx) => (
                  <div key={idx} className="text-xs text-gray-700">
                    {lang}
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Links Section */}
        {data.skillsLinks.linksEnabled &&
          (data.skillsLinks.links.linkedinProfile ||
            data.skillsLinks.links.githubProfile ||
            data.skillsLinks.links.portfolioUrl) && (
            <div className="page-break-inside-avoid">
              <h3 className="text-sm font-bold mb-3 text-gray-900">Links</h3>
              <div className="space-y-2 text-xs text-gray-700">
                {data.skillsLinks.links.linkedinEnabled &&
                  data.skillsLinks.links.linkedinProfile && (
                    <div>
                      <p className="font-semibold text-gray-800">LinkedIn</p>
                      <p className="break-words text-blue-600">
                        {data.skillsLinks.links.linkedinProfile}
                      </p>
                    </div>
                  )}
                {data.skillsLinks.links.githubEnabled &&
                  data.skillsLinks.links.githubProfile && (
                    <div>
                      <p className="font-semibold text-gray-800">GitHub</p>
                      <p className="break-words text-blue-600">
                        {data.skillsLinks.links.githubProfile}
                      </p>
                    </div>
                  )}
                {data.skillsLinks.links.portfolioEnabled &&
                  data.skillsLinks.links.portfolioUrl && (
                    <div>
                      <p className="font-semibold text-gray-800">Portfolio</p>
                      <p className="break-words text-blue-600">
                        {data.skillsLinks.links.portfolioUrl}
                      </p>
                      {data.skillsLinks.links.portfolioDescription && (
                        <p className="mt-1 text-gray-600">
                          {data.skillsLinks.links.portfolioDescription}
                        </p>
                      )}
                    </div>
                  )}
              </div>
            </div>
          )}
      </div>

      {/* Right Column - White Background */}
      <div className="w-[65%] bg-white p-6 flex flex-col space-y-6">
        {/* Header with Name and Title */}
        {fullName && (
          <div className="page-break-inside-avoid">
            <h1 className="text-3xl font-bold text-gray-900 leading-tight">
              {fullName.split(" ")[0]}
              {fullName.split(" ").length > 1 && (
                <>
                  <br />
                  {fullName.split(" ").slice(1).join(" ")}
                </>
              )}
            </h1>
            {getJobTitle() && (
              <p className="text-base text-gray-700 mt-1">{getJobTitle()}</p>
            )}
          </div>
        )}

        {/* Education Section */}
        {((data.education.sslcEnabled && data.education.sslc.instituteName) ||
          (data.education.preUniversityEnabled &&
            data.education.preUniversity.instituteName) ||
          (data.education.higherEducationEnabled &&
            data.education.higherEducation.length > 0)) && (
          <div className="page-break-inside-avoid">
            <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
              Education
            </h3>
            <div className="space-y-4">
              {/* Higher Education */}
              {data.education.higherEducationEnabled &&
                data.education.higherEducation.map((edu, idx) => (
                  <div key={edu.id || idx} className="page-break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs font-semibold text-gray-900">
                        {edu.degree}{" "}
                        {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                      </p>
                      {(edu.startYear || edu.endYear) && (
                        <span className="text-xs text-gray-600">
                          {edu.startYear} {edu.endYear && `- ${edu.endYear}`}
                        </span>
                      )}
                    </div>
                    {edu.instituteName && (
                      <p className="text-xs text-gray-700 mb-1">
                        {edu.instituteName}
                      </p>
                    )}
                    {edu.universityBoard && (
                      <p className="text-xs text-gray-600">
                        {edu.universityBoard}
                      </p>
                    )}
                    {edu.result && edu.resultFormat && (
                      <p className="text-xs text-gray-600 mt-1">
                        {edu.resultFormat}: {edu.result}
                      </p>
                    )}
                  </div>
                ))}

              {/* Pre-University / 12th */}
              {data.education.preUniversityEnabled &&
                data.education.preUniversity.instituteName && (
                  <div className="page-break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs font-semibold text-gray-900">
                        Pre-University / 12th{" "}
                        {data.education.preUniversity.subjectStream &&
                          `(${data.education.preUniversity.subjectStream})`}
                      </p>
                      {data.education.preUniversity.yearOfPassing && (
                        <span className="text-xs text-gray-600">
                          {data.education.preUniversity.yearOfPassing}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mb-1">
                      {data.education.preUniversity.instituteName}
                    </p>
                    {data.education.preUniversity.boardType && (
                      <p className="text-xs text-gray-600">
                        {data.education.preUniversity.boardType}
                      </p>
                    )}
                    {data.education.preUniversity.result &&
                      data.education.preUniversity.resultFormat && (
                        <p className="text-xs text-gray-600 mt-1">
                          {data.education.preUniversity.resultFormat}:{" "}
                          {data.education.preUniversity.result}
                        </p>
                      )}
                  </div>
                )}

              {/* SSLC / 10th */}
              {data.education.sslcEnabled &&
                data.education.sslc.instituteName && (
                  <div className="page-break-inside-avoid">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className="text-xs font-semibold text-gray-900">
                        SSLC / 10th
                      </p>
                      {data.education.sslc.yearOfPassing && (
                        <span className="text-xs text-gray-600">
                          {data.education.sslc.yearOfPassing}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-700 mb-1">
                      {data.education.sslc.instituteName}
                    </p>
                    {data.education.sslc.boardType && (
                      <p className="text-xs text-gray-600">
                        {data.education.sslc.boardType}
                      </p>
                    )}
                    {data.education.sslc.result &&
                      data.education.sslc.resultFormat && (
                        <p className="text-xs text-gray-600 mt-1">
                          {data.education.sslc.resultFormat}:{" "}
                          {data.education.sslc.result}
                        </p>
                      )}
                  </div>
                )}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {data.experience.workExperiences &&
          data.experience.workExperiences.some(
            (exp) => exp.enabled && (exp.companyName || exp.jobTitle)
          ) && (
            <div className="page-break-inside-avoid">
              <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
                Experience
              </h3>

              <div className="space-y-4">
                {data.experience.workExperiences
                  .filter(
                    (exp) => exp.enabled && (exp.companyName || exp.jobTitle)
                  )
                  .map((exp, idx) => (
                    <div
                      key={exp.id || idx}
                      className="page-break-inside-avoid"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        {exp.jobTitle && (
                          <p className="text-xs font-semibold text-gray-900">
                            {exp.jobTitle}
                          </p>
                        )}

                        {(exp.startDate ||
                          exp.endDate ||
                          exp.currentlyWorking) && (
                          <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                            {exp.startDate && formatMonthYear(exp.startDate)}
                            {" - "}
                            {exp.currentlyWorking
                              ? "Present"
                              : exp.endDate
                              ? formatMonthYear(exp.endDate)
                              : ""}
                          </span>
                        )}
                      </div>

                      {exp.companyName && (
                        <p className="text-xs text-gray-700 mb-1">
                          {exp.companyName}
                          {exp.location && ` | ${exp.location}`}
                        </p>
                      )}

                      {(exp.employmentType || exp.workMode) && (
                        <p className="text-xs text-gray-600 mb-1">
                          {exp.employmentType}
                          {exp.employmentType && exp.workMode && " • "}
                          {exp.workMode}
                        </p>
                      )}

                      {exp.description && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-2">
                          {exp.description}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Projects Section */}
        {data.projects &&
          data.projects.some((proj) => proj.enabled && proj.projectTitle) && (
            <div className="page-break-inside-avoid">
              <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
                Projects
              </h3>
              <div className="space-y-4">
                {data.projects
                  .filter((proj) => proj.enabled && proj.projectTitle)
                  .map((proj, idx) => (
                    <div
                      key={proj.id || idx}
                      className="page-break-inside-avoid"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="text-xs font-semibold text-gray-900">
                          {proj.projectTitle}
                        </p>
                        {(proj.startDate ||
                          proj.endDate ||
                          proj.currentlyWorking) && (
                          <span className="text-xs text-gray-600 whitespace-nowrap ml-2">
                            {proj.startDate && formatMonthYear(proj.startDate)}
                            {" - "}
                            {proj.currentlyWorking
                              ? "Present"
                              : proj.endDate
                              ? formatMonthYear(proj.endDate)
                              : ""}
                          </span>
                        )}
                      </div>

                      {proj.projectType && (
                        <p className="text-xs text-gray-700 mb-1">
                          {proj.projectType}
                        </p>
                      )}

                      {proj.description && (
                        <p className="text-xs text-gray-600 leading-relaxed mt-1">
                          {proj.description}
                        </p>
                      )}

                      {proj.rolesResponsibilities && (
                        <div className="mt-2">
                          <p className="text-xs font-semibold text-gray-800">
                            Roles & Responsibilities:
                          </p>
                          <p className="text-xs text-gray-600 leading-relaxed">
                            {proj.rolesResponsibilities}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Technical Summary Section */}
        {data.skillsLinks.technicalSummaryEnabled &&
          data.skillsLinks.technicalSummary && (
            <div className="page-break-inside-avoid">
              <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
                Technical Summary
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {data.skillsLinks.technicalSummary}
              </p>
            </div>
          )}

        {/* Certifications Section */}
        {data.certifications &&
          data.certifications.some(
            (cert) => cert.enabled && cert.certificateTitle
          ) && (
            <div className="page-break-inside-avoid">
              <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
                Certifications
              </h3>
              <div className="space-y-3">
                {data.certifications
                  .filter((cert) => cert.enabled && cert.certificateTitle)
                  .map((cert, idx) => (
                    <div
                      key={cert.id || idx}
                      className="page-break-inside-avoid"
                    >
                      <div className="flex justify-between items-baseline mb-1">
                        <p className="text-xs font-semibold text-gray-900">
                          {cert.certificateTitle}
                        </p>
                        {cert.date && (
                          <span className="text-xs text-gray-600">
                            {formatMonthYear(cert.date)}
                          </span>
                        )}
                      </div>

                      {cert.providedBy && (
                        <p className="text-xs text-gray-700 mb-1">
                          {cert.providedBy}
                          {cert.domain && ` • ${cert.domain}`}
                        </p>
                      )}

                      {cert.certificateType && (
                        <p className="text-xs text-gray-600 mb-1">
                          Type: {cert.certificateType}
                        </p>
                      )}

                      {cert.description && (
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {cert.description}
                        </p>
                      )}

                      {cert.certificateUrl && (
                        <p className="text-xs text-blue-600 mt-1 break-words">
                          {cert.certificateUrl}
                        </p>
                      )}
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Publications Section (if available in links) */}
        {data.skillsLinks.linksEnabled &&
          data.skillsLinks.links.publicationEnabled &&
          data.skillsLinks.links.publicationUrl && (
            <div className="page-break-inside-avoid">
              <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
                Publications
              </h3>
              <div className="text-xs">
                <p className="text-blue-600 break-words mb-1">
                  {data.skillsLinks.links.publicationUrl}
                </p>
                {data.skillsLinks.links.publicationEnabled &&
                  data.skillsLinks.links.publicationDescription && (
                    <p className="text-gray-600 leading-relaxed">
                      {data.skillsLinks.links.publicationDescription}
                    </p>
                  )}
              </div>
            </div>
          )}

        {/* Additional Personal Details (if needed) */}
        {(data.personal.dateOfBirth ||
          data.personal.nationality ||
          data.personal.passportNumber) && (
          <div className="page-break-inside-avoid">
            <h3 className="text-base font-bold mb-3 text-gray-900 border-b border-gray-300 pb-1">
              Personal Details
            </h3>
            <div className="space-y-1 text-xs text-gray-700">
              {data.personal.dateOfBirth && (
                <p>
                  <span className="font-semibold">Date of Birth:</span>{" "}
                  {new Date(data.personal.dateOfBirth).toLocaleDateString()}
                </p>
              )}
              {data.personal.gender && (
                <p>
                  <span className="font-semibold">Gender:</span>{" "}
                  {data.personal.gender}
                </p>
              )}
              {data.personal.nationality && (
                <p>
                  <span className="font-semibold">Nationality:</span>{" "}
                  {data.personal.nationality}
                </p>
              )}
              {data.personal.passportNumber && (
                <p>
                  <span className="font-semibold">Passport:</span>{" "}
                  {data.personal.passportNumber}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModernProfessionalTemplate;
