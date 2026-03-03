import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, FileText } from 'lucide-react';

const PolicyPage = () => {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <header className="bg-white shadow border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Shield className="w-8 h-8 text-brand" />
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
                        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Privacy Policy</h1>
                        <p className="text-gray-500 font-medium text-lg">Last updated: {new Date().toLocaleDateString()}</p>
                    </div>

                    <div className="prose prose-lg prose-brand max-w-none text-gray-700 space-y-8">

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                1. Introduction
                            </h2>
                            <p>
                                Welcome to ShopManager ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website (regardless of where you visit it from) or use our application, and tell you about your privacy rights.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                2. The Data We Collect About You
                            </h2>
                            <p>
                                Personal data, or personal information, means any information about an individual from which that person can be identified. We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li><strong>Identity Data:</strong> includes first name, last name, username or similar identifier (such as your Google profile name).</li>
                                <li><strong>Contact Data:</strong> includes your email address.</li>
                                <li><strong>Transaction & Subscription Data:</strong> includes details about payments to and from you and other details of products, services, or subscriptions you have purchased from us. Note: Payment details are securely processed by third-party gateways; we do not store full credit card numbers.</li>
                                <li><strong>Technical Data:</strong> includes internet protocol (IP) address, your login data, browser type and version, time zone setting and location.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                3. How We Use Your Personal Data
                            </h2>
                            <p>
                                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 mt-4">
                                <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., providing your ShopManager account).</li>
                                <li>To manage your account, including subscriptions and billing.</li>
                                <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                4. Third-Party Sign-In (Google OAuth)
                            </h2>
                            <p>
                                We offer the ability to register and log in using your Google account. If you choose this option, we will receive certain profile information about you from your Google account. The specific information we receive depends on your Google account privacy settings, but will typically include your name, email address, and profile picture.
                            </p>
                            <p className="mt-2">
                                We will only use the information we receive for the purposes that are described in this privacy policy or that are otherwise made clear to you on the relevant Services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                5. Data Security
                            </h2>
                            <p>
                                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used or accessed in an unauthorised way, altered or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors and other third parties who have a business need to know.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                6. Contact Us
                            </h2>
                            <p>
                                If you have any questions about this privacy policy or our privacy practices, please contact us at our provided support email.
                            </p>
                        </section>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default PolicyPage;
