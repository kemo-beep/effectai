"use client";

import { useState, useEffect } from "react";
import { Button } from "../Button/Button";
import { cn } from "../../lib/utils";
import { Zap, Menu, X } from "lucide-react";
import Link from "next/link";

export const Navbar = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Gallery", href: "#" },
        { name: "Pricing", href: "#" },
        { name: "Docs", href: "#" },
    ];

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "py-4" : "py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div
                    className={cn(
                        "rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between transition-all duration-300",
                        scrolled
                            ? "bg-background-secondary/80 backdrop-blur-xl border border-white/10 shadow-lg"
                            : "bg-transparent border border-transparent"
                    )}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                            <Zap className="w-6 h-6 text-white fill-white" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-white tracking-tight group-hover:text-primary-200 transition-colors">
                                MotionForge
                            </span>
                            <span className="text-[10px] uppercase tracking-wider text-primary-200 font-semibold opacity-80">
                                AI Studio
                            </span>
                        </div>
                    </div>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-sm font-medium text-white/60 hover:text-white transition-colors relative group"
                            >
                                {item.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-500 transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button variant="ghost" size="sm">
                            Log In
                        </Button>
                        <Button variant="primary" size="sm">
                            Get Started
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white/60 hover:text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 p-4 animate-in-up">
                    <div className="glass-panel rounded-2xl p-4 flex flex-col gap-4">
                        {navLinks.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="text-base font-medium text-white/80 hover:text-white px-4 py-2 hover:bg-white/5 rounded-lg transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                        <div className="h-px bg-white/10 my-2" />
                        <Button variant="ghost" className="w-full justify-start">
                            Log In
                        </Button>
                        <Button variant="primary" className="w-full">
                            Get Started
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};
