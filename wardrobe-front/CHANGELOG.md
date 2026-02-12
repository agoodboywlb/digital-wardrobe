# Changelog

## [Unreleased]

### Added
-   **Change Password**: Authenticated users can now update their password via `Settings -> Account -> Change Password`.
-   **Forgot Password Flow**: Comprehensive email reset flow including `ForgotPasswordPage` and `ResetPasswordPage`.
    -   *Fixed*: Resolved "Auth session missing" error caused by `HashRouter` double-hash tokens.
-   **Profile Editing**: Users can edit basic profile info and body measurements.
-   **Auth**: Implemented Email/Password authentication with Supabase.
