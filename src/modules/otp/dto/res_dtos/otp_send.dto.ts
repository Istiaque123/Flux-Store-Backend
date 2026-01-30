export interface OtpSendResponse {
  email?: string | null;
  phone?: string | null;
  otp_code: string;
  expires_at: Date;
  is_used: boolean;
}
