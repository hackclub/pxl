type RateLimitRecord = {
	count: number;
	resetAt: number;
};

const requestCounts = new Map<string, RateLimitRecord>();

export function checkRateLimit(
	identifier: string, // user email, IP, etc.
	maxRequests: number, // e.g., 10
	windowMs: number // e.g., 10000 (10 seconds)
): boolean {
	const now = Date.now();
	const record = requestCounts.get(identifier);

	// No record or window expired? Start fresh
	if (!record || now > record.resetAt) {
		requestCounts.set(identifier, {
			count: 1,
			resetAt: now + windowMs
		});
		return true; // allowed
	}

	// Already hit limit?
	if (record.count >= maxRequests) {
		return false; // denied
	}

	// Increment and allow
	record.count++;
	return true;
}

// Optional: Clean up old entries periodically
setInterval(() => {
	const now = Date.now();
	for (const [key, record] of requestCounts.entries()) {
		if (now > record.resetAt) {
			requestCounts.delete(key);
		}
	}
}, 60000); // cleanup every minute
