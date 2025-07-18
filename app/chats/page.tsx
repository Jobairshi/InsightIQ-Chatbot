'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ChatsPage() {
    const router = useRouter();

    React.useEffect(() => {
        // Redirect to main page with chat tab
        router.push('/?tab=chat');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <div className="text-4xl mb-4">💬</div>
                <p className="text-gray-600">Redirecting to chat...</p>
            </div>
        </div>
    );
}
