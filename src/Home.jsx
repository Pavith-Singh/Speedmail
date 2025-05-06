function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-violet-500 from-10% via-fuchsia-500 via-50% to-orange-500 to-100% animate-gradient">
            <nav className="px-6 py-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-orange-500">SpeedMail</h2>
                <div className="space-x-4">
                    <a href="/signin" className="text-gray-600 hover:text-violet-600">Sign In</a>
                    <a href="/adminsignin" className="px-4 py-2 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700">
                        Register
                    </a>
                </div>
            </nav>
            
            <main className="max-w-4xl mx-auto px-6 py-16">
                <div className="text-center space-y-8">
                    <h1 className="text-5xl font-bold text-orange-400">
                        Secure & Private Email System For Porsche Australia Employees
                    </h1>
                    <p className="text-xl text-white max-w-2xl mx-auto">
                        SpeedMail helps you manage and send emails faster than ever before. 
                        Streamline your communication with our powerful email management platform.
                    </p>
                    <div className="space-x-4 pt-4">
                        <a href="/signin" 
                           className="px-8 py-3 bg-fuchsia-600 text-white rounded-lg hover:bg-fuchsia-700 inline-block">
                            Get Started
                        </a>
                        <a href="https://www.porsche.com/australia/" 
                           className="px-8 py-3 border border-gray-300 rounded-lg hover:border-orange-500 hover:fuchsia-600 hover:text-orange-500 inline-block">
                            Learn More
                        </a>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Home;