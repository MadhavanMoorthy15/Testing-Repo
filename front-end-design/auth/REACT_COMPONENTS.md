# React Component Breakdown

## Component Structure for React Conversion

### 1. **AuthLayout** (Container Component)
- **Purpose**: Wrapper for authentication pages
- **Features**: 
  - Centered layout
  - Background styling
  - Responsive container
- **Props**: `children`

### 2. **AuthCard** (Presentational Component)
- **Purpose**: White card container for auth forms
- **Features**: 
  - Card styling with shadow
  - Padding and border radius
  - Animation on mount
- **Props**: `title`, `children`, `footer`

### 3. **SignUpForm** (Smart Component)
- **Purpose**: Complete sign-up form with validation
- **State**:
  - `name` (string)
  - `email` (string)
  - `password` (string)
  - `confirmPassword` (string)
  - `errors` (object)
  - `isLoading` (boolean)
- **Methods**: 
  - `handleSubmit()`
  - `validateForm()`
  - `handleInputChange()`
- **Child Components**: `FormGroup`, `Button`, `Link`

### 4. **SignInForm** (Smart Component)
- **Purpose**: Sign-in form with OAuth options
- **State**:
  - `email` (string)
  - `password` (string)
  - `errors` (object)
  - `isLoading` (boolean)
- **Methods**: 
  - `handleSubmit()`
  - `validateForm()`
  - `handleInputChange()`
  - `handleOAuthLogin(provider)`
- **Child Components**: `FormGroup`, `Button`, `OAuthButtons`, `Divider`

### 5. **FormGroup** (Reusable Component)
- **Purpose**: Label + Input field combination; supports type, error, and password toggle
- **Props**:
  - `label` (string)
  - `type` (string: text, email, password)
  - `name` (string)
  - `value` (string)
  - `onChange` (function(value))
  - `placeholder` (string)
  - `error` (string | undefined)
  - `showPasswordToggle` (boolean; replaced with `isPassword` prop in implementation)
  - `link` (object: { text, href, onClick })
- **Features**: 
  - Error display
  - Password visibility toggle (button with eye/eye-off icon)
  - Optional link (e.g., "Forgot password?") as a button, not anchor

### 6. **PasswordInput** (Reusable Component)
- *[Replaced by `FormGroup` isPassword prop and toggle logic]*

### 7. **Button** (Reusable Component)
- **Purpose**: Primary and OAuth styled buttons
- **Props**:
  - `variant` ('primary' | 'oauth')
  - `children` (ReactNode)
  - `onClick` (function)
  - `disabled` (boolean)
  - `loading` (boolean)
  - `icon` (ReactNode - for OAuth buttons)
  - `type` ('button' | 'submit')
- **Variants**: 
  - Primary (blue, full width)
  - OAuth (white, bordered, with icon)

### 8. **OAuthButtons** (Component)
- **Purpose**: Container for OAuth provider buttons (UI only, no real OAuth)
- **Props/Behavior**: 
  - Two buttons for Google/Microsoft, each with correct icon and click placeholder

### 9. **Divider** (Presentational Component)
- **Purpose**: "Or" divider with horizontal line
- **Props**: `text` (string, default: "Or")
- **Features**: Line with centered text

### 10. **Link** (Reusable Component)
- **Purpose**: Styled navigation links
- **Props**:
  - `href` (string) or `onClick` (function)
  - `children` (ReactNode)
- **Features**: Hover states, color transitions

---

## Folder Structure Recommendation (synced to code)

```
src/
├── components/
│   ├── auth/
│   │   ├── AuthCard.tsx
│   │   ├── SignUpForm.tsx
│   │   ├── SignInForm.tsx
│   │   └── OAuthButtons.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Divider.tsx
│   │   ├── FormGroup.tsx
├── pages/
│   ├── SignUpPage.tsx
│   └── SignInPage.tsx
├── hooks/
│   └── useAuth.ts
├── styles/
│   ├── auth.module.css
│   └── variables.css
└── utils/
    └── validation.ts
```

---

## State Management
- Uses Context API (`AuthContext`)
- Auth state and methods provided by hook in `/contexts/AuthContext.tsx`
- Errors and loading states implemented as described

---

## Custom Hooks
- `useAuth` for auth state/actions; `useForm` not present (simple `useState` used)

---

## Validation Requirements
- **Sign Up:** Name required (min 2 chars), Email valid, Password min 8 chars + 1 uppercase + 1 number, Confirm Password match
- **Sign In:** Email valid, Password required

---

## Icons and Accessibility
- Password input eye toggle is a button inside `FormGroup`
- All inputs use `aria-label` or are correctly labelled
- All buttons keyboard accessible (including links for nav or "forgot password?")

---

## Additional Features
- Loading disables form/button
- "Forgot password" is a non-functional link, as per spec

---

## OAuth Integration Points
- Buttons present for Google/Microsoft OAuth, but log to console as UI placeholder (per constraints)

---

## Review (sync points)

- Updated description of `FormGroup` to match current implementation (`isPassword` + toggle, not separate `PasswordInput`)
- Noted OAuth buttons as placeholders only
- Updated state/code breakdown to match functional code and design skeleton
