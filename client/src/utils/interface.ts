// API body types
export interface UserItem {
  firstName?: string;
  lastName?: string;
  companyName?: string;
  email: string;
  address?: string;
  phoneNumber?: string;
  password: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface DomainItem {
  name: string;
}

export interface CartItem {
  name: string;
  regPeriod: number;
  price: number;
  nameservers?: string[];
}

export interface VoltCalcItem {
  previousReading: number;
  currentReading: number;
  tariffBand: string;
}

export interface StorageSyncItem {
  fileType: string;
  prevStorageName: string;
  prevApiKey: string;
  prevSecretKey: string;
  prevRegion?: string;
  newStorageName: string;
  newApiKey: string;
  newSecretKey: string;
  newRegion?: string;
  prevAccountId?: string;
  newAccountId?: string;
}

// State types
export interface AuthState {
  accessToken: string | null;
  userEmail: string;
  isLoading: boolean;
  message: string | null;
  error: string | null;
  setUserEmail: (email: string) => void;
  setAccessToken: (token: string | null) => void;
  signup: (
    data: RegisterUserItem,
  ) => Promise<{ message: string | null; error: string | null }>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (
    email: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  sendPasscode: (
    email: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  login: (
    email: string,
    passcode: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  logout: () => void;
  logoutAll: () => Promise<void>;
}

export interface UserState {
  users: string[];
  currentUser: string[];
  token: string;
  loading: boolean;
  message: string;
  error: string;

  action: {
    getUserProfile: () => void;
    loginUser: (item: UserItem) => void;
    registerUser: (item: UserItem) => void;
    updateUserProfile: (item: UserItem) => void;
    updateUserPassword: (item: {
      currentPassword: string;
      newPassword: string;
      confimPassword: string;
    }) => void;
    deleteUserProfile: () => void;
    createAdminUser: (item: UserItem) => void;
    getUserDetails: (userId: string) => void;
    restoreUserAccount: (userId: string) => void;
    removeUserAccount: (userId: string) => void;
    clearUser: () => void;
    logout: () => void;
  };
}

export interface DomainState {
  domain: any;
  domainStatus: string;
  loading: boolean;
  message: string;
  error: string;

  action: {
    searchDomain: (item: DomainItem) => void;
    clearDomain: () => void;
  };
}

export interface ToolState {
  voltCalc: string[];
  storageSync: string[];
  loading: boolean;
  message: string;
  error: string;

  action: {
    voltCalc: (item: VoltCalcItem) => void;
    storageSync: (item: StorageSyncItem) => void;
    clearVoltCalc: () => void;
    clearStorageSync: () => void;
  };
}

export interface LogState {
  logs: string[];
  loading: boolean;
  message: string;
  error: string;

  action: {
    getLog: () => void;
    clearLog: () => void;
  };
}

// Form types
export interface RequestItem {
  name: string;
  service: string;
  email: string;
  domain: string;
  provider?: string;
  description: string;
  priority: string;
}

export interface ContactItem {
  name: string;
  inquiry: string;
  email: string;
  subject: string;
  message: string;
}

export interface SendEmailItem {
  email: string;
}

export interface RegisterUserItem {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

export interface VerifyUserItem {
  token: string;
}

export interface LoginUserItem {
  email: string;
  password: string;
}
