const paymentMode = {
  CASH: 'Cash',
  CHEQUE: 'Cheque',
  UPI: 'UPI',
  WAIVE_OFF: 'Waive Off',
  NETBANKING: 'NetBanking',
};

const employeeRepaymentType = {
  ADVANCE: 'Advance',
  PENALTY: 'Penalty',
};

const frequencyTypes = ['once', 'daily', 'weekly', 'fortnight', 'monthly'];

const documentTypes = ['.pdf', '.jpg', '.png', '.jpeg'];
const bonusType = ['Paid', 'Un-Paid'];

const preboardingFormCustomizeFieldDropDown = [
  {
    name: 'Date',
    value: 'date',
  },
  {
    name: 'Dropdown',
    value: 'dropdown',
  },
  {
    name: 'Image',
    value: 'image',
  },
  {
    name: 'Month',
    value: 'month',
  },
  {
    name: 'Number',
    value: 'number',
  },
  {
    name: 'Pdf',
    value: 'pdf',
  },
  {
    name: 'Radio',
    value: 'radio',
  },
  {
    name: 'Signature',
    value: 'signature',
  },
  {
    name: 'Text',
    value: 'text',
  },
  {
    name: 'Text Area',
    value: 'textarea',
  },
  {
    name: 'Title',
    value: 'title',
  },
];

const letterTypesENUM = {
  TERMINATIONLETTER: 'terminationletter',
  OFFERLETTER: 'offerletter',
  EXPERIENCELETTER: 'experienceletter',
  JOININGLETTER: 'joiningletter',
  APPOINTMENTLETTER: 'appointmentletter',
};

const mailTemplateTypes = {
  leaveEmailTemplate: 1,
  expenseMailTemplate: 2,
  leaveRejectEmailTemplate: 3,
  leaveAcceptEmailTemplate: 4,
  expenseAcceptMailTemplate: 5,
  expenseRejectMailTemplate: 6,
  leaveUpdateEmailTemplate: 7,
  expenseUpdateMailTemplate: 8,
  offerLetterMailTemplate: 9,
  joiningLetterMailTemplate: 10,
  appointmentLetterMailTemplate: 11,
  experienceLetterMailTemplate: 12,
  terminationLetterMailTemplate: 13,
  incrementLetterMailTemplate: 14,
  outdoorDutyEmailTemplate: 15,
  outdoorDutyRejectEmailTemplate: 16,
  outdoorDutyAcceptEmailTemplate: 17,
  jobApplicationAcceptMailTemplate: 18,
  discrepancyMailTemplate: 19,
  jobApplicationRejectMailTemplate: 20,
  preBoardingAcceptMailTemplate: 21,
  preBoardingRejectMailTemplate: 22,
  preBoardingApplicationAcknowledgementMailTemplate: 23,
  jobApplicationAcknowledgementMailTemplate: 24,
};

const letterTemplateTypes = {
  offerLetterTemplate: 1,
  joiningLetterTemplate: 2,
  experienceLetterTemplate: 3,
  incrementLetterTemplate: 4,
  terminationLetterTemplate: 5,
  appointmentLetterTemplate: 6,
  discrepancyLetterTemplate: 7,
};

const authorizationMasterTypes = {
  leave: 1,
  expense: 2,
  overtime: 3,
  resignation: 5,
  employeeGatePass: 6,
  attendanceCorrection: 7,
  compensatoryOff: 8,
};

const preboardingStatusTypes = {
  SCREENING: 'Screening',
  INTERVIEW: 'Interview',
  ACCEPT: 'Accept',
  REJECT: 'Reject',
  ONHOLD: 'OnHold',
  ONBOARDED: 'OnBoarded',
  HRROUND: 'HR Round',
};

const InterViewTypeENUM = {
  VIRTUAL: 'virtual',
  INPERSON: 'inperson',
};

const customizeProfileFields = {
  branchName: 'Branch Name',
  companyName: 'Company Name',
  contactNo: 'Contact No',
  dateOfBirth: 'Date Of Birth',
  department: 'Department',
  designation: 'Designation',
  email: 'Email',
};

const letterHeadOptions = [
  {
    Label: 'No',
    value: 'no',
  },
  {
    Label: 'Predefined',
    value: 'yes',
  },
  {
    Label: 'Uploaded',
    value: 'uploaded',
  },
];

const attendaceTransType = {
  biometricNotValidated: 0,
  biometricNC: 1,
  tpMirrorNotValidated: 3,
  tpMirrorNC: 4,
};

const attendanceTransactionType = {
  notValidated: 'Not Validated',
  notConsider: 'NC',
};

const attendanceFromType = {
  MOBILE: 'mobile',
  BIOMETRIC: 'biometric',
  TPMIRROR: 'tpmirror',
  MOBILEANDBIOMETRIC: 'mobileandbiometric',
  MOBILEANDTPMIRROR: 'mobileandtpmirror',
};

const updateBranchJob = [
  { Label: 'Branch', value: 'BRANCH' },
  { Label: 'Department', value: 'DEPARTMENT' },
  { Label: 'Designation', value: 'DESIGNATION' },
  { Label: 'Division', value: 'DIVISION' },
  { Label: 'Project', value: 'PROJECT' },
  { Label: 'Reports To', value: 'REPORTSTO' },
  { Label: 'Skill Category', value: 'SKILLCATEGORY' },
  { Label: 'Working Area', value: 'WORKINGAREA' },
  { Label: 'Working Location', value: 'WORKINGLOCATION' },
];

const updateBranchJobTypes = {
  BRANCH: 'BRANCH',
  DEPARTMENT: 'DEPARTMENT',
  DESIGNATION: 'DESIGNATION',
  DIVISION: 'DIVISION',
  PROJECT: 'PROJECT',
  REPORTSTO: 'REPORTSTO',
  SKILLCATEGORY: 'SKILLCATEGORY',
  WORKINGAREA: 'WORKINGAREA',
  WORKINGLOCATION: 'WORKINGLOCATION',
};


const expenseTypeArray = [
  { name: 'Personal', value: 'Personal' },
  { name: 'Project', value: 'Project' },
  { name: 'Tour', value: 'Tour' },
  { name: 'Visit', value: 'Visit' },
];

const officeExpenseTypeArray = [
  { name: 'Branch', value: 'Branch' },
  { name: 'Site', value: 'Site' },
];

const officeExpenseTypes = {
  BRANCH: 'Branch',
  SITE: 'Site',
};

const expenseTypes = {
  ALL: 'All',
  PERSONAL: 'Personal',
  PROJECT: 'Project',
  TOUR: 'Tour',
  VISIT: 'Visit',
};

const authorizationCriteriaType = {
  ANYTWO: 3,
  ANYONE: 4,
  SEQUENCENO: 5,
  ANYTHREE: 6,
};

const expenseTypeArrayForDropDown = [
  { name: 'All', value: 'All' },
  { name: 'Personal', value: 'Personal' },
  { name: 'Project', value: 'Project' },
  { name: 'Tour', value: 'Tour' },
  { name: 'Visit', value: 'Visit' },
];

const expenseApprovalTypes = {
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING: 'Pending',
  PAID: 'Paid',
};
const attendanceBranchTypeRule = {
  ALL: 'all',
  SELECTED: 'selected',
  ASSIGNED: 'assigned',
};

const officeExpenseAdvanceTransactionType = [
  { key: 'CREDIT', value: 'CREDIT' },
  { key: 'DEBIT', value: 'DEBIT' }
];

export {
  paymentMode,
  employeeRepaymentType,
  frequencyTypes,
  documentTypes,
  bonusType,
  preboardingFormCustomizeFieldDropDown,
  letterTypesENUM,
  mailTemplateTypes,
  letterTemplateTypes,
  authorizationMasterTypes,
  preboardingStatusTypes,
  InterViewTypeENUM,
  customizeProfileFields,
  letterHeadOptions,
  attendaceTransType,
  attendanceTransactionType,
  attendanceFromType,
  updateBranchJob,
  updateBranchJobTypes,
  expenseTypeArray,
  expenseTypes,
  authorizationCriteriaType,
  expenseTypeArrayForDropDown,
  expenseApprovalTypes,
  attendanceBranchTypeRule,
  officeExpenseTypeArray,
  officeExpenseTypes,
  officeExpenseAdvanceTransactionType
};
