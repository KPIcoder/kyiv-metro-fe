import { SignIn } from "@clerk/clerk-react";
import { cn } from "@/lib/utils";

export function SignInPage() {
  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <div className="flex flex-col items-center justify-center w-full max-w-lg p-4">
        <div className="w-20 h-20 mb-4 rounded-full flex items-center justify-center bg-muted">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-foreground"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
        <p className="text-muted-foreground mb-6">Sign in to your account to continue</p>
        
        <div className="w-full max-w-sm">
          <SignIn 
            appearance={{
              layout: {
                showOptionalFields: false,
                socialButtonsPlacement: "bottom",
                socialButtonsVariant: "blockButton",
                termsPageUrl: "https://clerk.com/terms"
              },
              elements: {
                rootBox: "w-full",
                card: "w-full shadow-none p-0 border-0 bg-transparent",
                header: "hidden",
                footer: "hidden",
                main: "gap-2 w-full",
                form: "w-full gap-4",
                formFieldRow: "w-full",
                formButtonPrimary: "bg-foreground text-background hover:bg-foreground/90 w-full h-10 rounded-md",
                formFieldInput: "w-full h-10 rounded-md border border-input bg-background",
                formFieldLabel: "text-sm font-medium text-foreground",
                socialButtonsBlockButton: "border border-input bg-background hover:bg-accent h-10 rounded-md",
                socialButtonsBlockButtonText: "text-sm font-medium text-foreground",
                socialButtonsProviderIcon: "h-5 w-5",
                dividerLine: "bg-muted",
                dividerText: "text-xs text-muted-foreground px-2",
                identityPreview: "hidden",
                formHeaderTitle: "hidden",
                formHeaderSubtitle: "hidden",
              }
            }}
          />
        </div>
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Kyiv Metro App © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  );
} 