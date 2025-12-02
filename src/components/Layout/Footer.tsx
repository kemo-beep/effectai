import { Zap, Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-white/5 bg-background-secondary/30 backdrop-blur-lg mt-auto relative z-10">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow-sm">
                                <Zap className="w-5 h-5 text-white fill-white" />
                            </div>
                            <span className="text-lg font-bold text-white">MotionForge</span>
                        </div>
                        <p className="text-sm text-white/40 max-w-xs leading-relaxed">
                            The next generation of motion graphics creation. Powered by
                            artificial intelligence to help you create stunning videos in
                            minutes.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-4">Product</h4>
                        <ul className="space-y-2 text-sm text-white/40">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Templates
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Showcase
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-white mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-white/40">
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="hover:text-white transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-white/30">
                        © 2025 MotionForge AI. All rights reserved.
                    </p>
                    <div className="flex gap-6 items-center">
                        <Link
                            href="#"
                            className="text-white/30 hover:text-white transition-colors"
                        >
                            <Github className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-white/30 hover:text-white transition-colors"
                        >
                            <Twitter className="w-5 h-5" />
                        </Link>
                        <Link
                            href="#"
                            className="text-white/30 hover:text-white transition-colors"
                        >
                            <Linkedin className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};
