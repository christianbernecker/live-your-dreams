const SENSITIVE = ['password', 'totp', 'token', 'authorization', 'cookie', 'email'];

export function redact(input: any) {
  try {
    return JSON.parse(JSON.stringify(input, (k, v) => 
      SENSITIVE.includes(k.toLowerCase()) ? '***' : v
    ));
  } catch {
    return {};
  }
}
