import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Scale } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Scale className="w-8 h-8 text-brand" />
                        <span className="font-bold text-xl tracking-tight text-gray-900">ShopManager</span>
                    </div>
                    <Link to="/" className="text-gray-500 hover:text-gray-900 transition flex items-center gap-2 font-medium">
                        <ArrowLeft className="w-5 h-5" />
                        <span className="hidden sm:inline">Back</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12">
                    <div className="mb-10 text-center sm:text-left">
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Terms of Service</h1>
                        <p className="text-gray-500 font-medium text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-lg prose-brand max-w-none text-gray-700 space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                1. Agreement to Terms
                            </h2>
                            <p>
                                These Terms of Service constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and ShopManager ("we," "us" or "our"), concerning your access to and use of our application and website. You agree that by accessing the site and application, you have read, understood, and agree to be bound by all of these Terms of Service.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                2. User Registration & Accounts
                            </h2>
                            <p>
                                You may be required to register with the site. You agree to keep your password confidential and will be responsible for all use of your account and password. We reserve the right to remove, reclaim, or change a username you select if we determine, in our sole discretion, that such username is inappropriate, obscene, or otherwise objectionable.
                            </p>
                            <p className="mt-2">
                                You can also register and log in using third-party services like Google. By doing so, you agree to comply with Google's terms and privacy policies in addition to ours.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                3. Subscriptions and Billing
                            </h2>
                            <p>
                                <strong>Free Trials:</strong> We may offer free trials of our premium subscriptions. Once the trial ends, you will be billed according to the subscription plan you selected, unless canceled prior.
                            </p>
                            <p className="mt-2">
                                <strong>Subscription Fees:</strong> Certain features of the application may be offered on a subscription basis. You agree to pay all charges or fees at the prices then in effect for your purchases, and you authorize us to charge your chosen payment provider for any such amounts upon placing your order.
                            </p>
                            <p className="mt-2">
                                <strong>Renewals and Cancellations:</strong> Subscriptions generally automatically renew unless you cancel them. You can cancel your subscription at any time by logging into your account or contacting us. Your cancellation will take effect at the end of the current paid term.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                4. Acceptable Use
                            </h2>
                            <p>
                                You may not access or use the application for any purpose other than that for which we make the application available. The application may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                5. Modifications and Interruptions
                            </h2>
                            <p>
                                We reserve the right to change, modify, or remove the contents of the application at any time or for any reason at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of the application without notice at any time. We will not be liable to you or any third party for any modification, price change, suspension, or discontinuance of the application.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">
                                6. Disclaimer
                            </h2>
                            <p>
                                THE APPLICATION IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE APPLICATION AND OUR SERVICES WILL BE AT YOUR SOLE RISK.
                            </p>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsOfService;
