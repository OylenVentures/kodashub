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
        updateUserPassword: (item: { currentPassword: string, newPassword: string, confimPassword: string }) => void;
        deleteUserProfile: () => void;
        createAdminUser: (item: UserItem) => void;
        getUserDetails: (userId: string) => void;
        restoreUserAccount: (userId: string) => void;
        removeUserAccount: (userId: string) => void;
        clearUser: () => void;
        logout: () => void;
    }
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
    }
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
    }
}

export interface LogState {
    logs: string[];
    loading: boolean;
    message: string;
    error: string;

    action: {
        getLog: () => void;
        clearLog: () => void;
    }
}
