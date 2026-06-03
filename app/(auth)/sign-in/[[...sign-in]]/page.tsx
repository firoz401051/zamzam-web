import { SignIn } from "@clerk/nextjs";

const SignInPage = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary:
                "bg-zamzam-primary hover:bg-zamzam-primary-hover text-white transition-colors duration-200",
              card: "shadow-2xl border-0 rounded-xl",
              headerTitle: "text-2xl font-bold text-gray-900",
              headerSubtitle: "text-gray-600",
              socialButtonsBlockButton:
                "border-2 border-gray-200 hover:border-zamzam-primary transition-colors duration-200",
              dividerLine: "bg-gray-200",
              dividerText: "text-gray-500",
              formFieldInput:
                "border-2 border-gray-200 focus:border-zamzam-primary transition-colors duration-200",
              footerActionLink:
                "text-zamzam-primary hover:text-zamzam-primary-hover transition-colors duration-200",
            },
          }}
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />
      </div>
    </div>
  );
};

export default SignInPage;
