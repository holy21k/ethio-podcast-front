import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#0b0215] flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-3xl font-bold text-white mb-4">Something went wrong.</h1>
                    <p className="text-gray-400 mb-6 max-w-md">
                        The application encountered an unexpected error.
                        {this.state.error && <span className="block mt-2 text-xs text-red-400 font-mono">{this.state.error.toString()}</span>}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition"
                    >
                        Reload Page
                    </button>
                    <button
                        onClick={() => window.location.href = '/home'}
                        className="mt-4 text-purple-400 hover:text-purple-300 text-sm"
                    >
                        Go to Home
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
