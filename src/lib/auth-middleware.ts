import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromHeader, verifyToken } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  userId?: string;
  userEmail?: string;
  isAdmin?: boolean;
}

// Middleware to protect API routes - requires authentication
export function withAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Add user info to request
    (request as any).userId = payload.userId;
    (request as any).userEmail = payload.email;
    (request as any).isAdmin = payload.isAdmin || false;

    return handler(request);
  };
}

// Middleware to protect admin routes - requires admin role
export function withAdminAuth(handler: Function) {
  return async (request: NextRequest) => {
    const token = getTokenFromHeader(request.headers.get('authorization'));
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (!payload.isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Add user info to request
    (request as any).userId = payload.userId;
    (request as any).userEmail = payload.email;
    (request as any).isAdmin = true;

    return handler(request);
  };
}
