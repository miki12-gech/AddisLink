
import { NextRequest, NextResponse } from 'next/server';

export const config = {
    matcher: ['/admin/:path*'],
};

export function middleware(req: NextRequest) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
        const authValue = basicAuth.split(' ')[1];
        const [user, pwd] = atob(authValue).split(':');

        // Hardcoded credentials for MVP
        if (user === 'admin' && pwd === 'password123') {
            return NextResponse.next();
        }
    }

    return new NextResponse('Auth Required', {
        status: 401,
        headers: {
            'WWW-Authenticate': 'Basic realm="Secure Area"',
        },
    });
}
