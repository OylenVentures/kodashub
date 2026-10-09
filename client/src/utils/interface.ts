// API body types
export interface UserItem {
  id?: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  passwordExpires?: Date;
  phone?: string;
  role?: string;
  status?: string;
  isEmailVerified?: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationExpires?: Date;
  failedLoginAttempts?: number;
  lockUntil?: Date;
  lastLoginAt?: Date;
  lastLoginIp?: string;
  createdAt?: Date;
  updatedAt?: Date;
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
  verifyEmail: (
    token: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  resendVerification: (
    email: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  login: (
    email: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  verifyPasscode: (
    email: string,
    passcode: string,
  ) => Promise<{ message: string | null; error: string | null }>;
  refreshToken: () => Promise<{
    accessToken?: string;
    userEmail?: string;
    error?: string;
  }>;
  logout: () => void;
  logoutAll: () => Promise<void>;
}

export interface TicketState {
  tickets: TicketItem[];
  replies: ReplyItem[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  message: string;
  error: string;

  action: {
    setReplies: (replies: []) => void;
    listTickets: (
      data: TicketQueryItem,
    ) => Promise<{ message?: string; error?: string }>;
    viewTicket: (id: string) => Promise<{ replies?: string; error?: string }>;
    createTicket: (
      data: TicketBodyItem,
    ) => Promise<{ message?: string; error?: string }>;
    replyTicket: (
      id: string,
      data: TicketReplyItem,
    ) => Promise<{ ticket?: string; message?: string; error?: string }>;
  };
}

export interface UserState {
  user: [];
  isLoading: boolean;
  message: string;
  error: string;

  action: {
    setUser: (user: []) => void;
    getUserProfile: () => Promise<{ user?: []; error?: string }>;
    updateUserProfile: (
      item: UserItem,
    ) => Promise<{ user?: UserItem; error?: string }>;
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

export interface TicketQueryItem {
  page: number;
  limit: number;
  status?: string;
  department?: string;
  priority?: string;
}

export interface TicketBodyItem {
  department: string;
  priority: string;
  subject: string;
  message: string;
}

export interface TicketReplyItem {
  message: string;
}

export interface TicketItem {
  id: string;
  ticketId: string;
  userId: string;
  user: UserItem;
  assignedStaffId?: string;
  assignedStaff?: UserItem;
  subject: string;
  department: string;
  priority: string;
  status: string;
  replies: ReplyItem;
  lastRepliedAt?: Date;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReplyItem {
  id: string;
  ticketId: string;
  ticket: TicketItem;
  authorId: string;
  author: UserItem;
  isStaffReply: boolean;
  message: string;
  createdAt: Date;
}
