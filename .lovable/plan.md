I will implement reactive synchronization for the profile photo and name, fix the bug in the reports page where a partner was incorrectly shown, and ensure the image cropper works correctly everywhere.

### 1. Unified State Management (SSoT)
- **`src/components/layout-dashboard.tsx`**:
    - Replace local avatar/name editing logic with the `ProfileAvatar` component to ensure consistency and cropper functionality.
    - Ensure all UI elements consume data from the `useProfile` hook instead of local variables or the static `useFinanceStore` defaults.
    - Update the sidebar and header to be fully reactive to profile changes.

### 2. Reports Page Fix (Partner Bug)
- **`src/routes/relatorios.tsx`**:
    - Use `useProfile` to determine if a partner actually exists.
    - Replace hardcoded names (\"Jorge\", \"Lilian\") with dynamic names from the user profiles.
    - Adjust calculations and UI to handle cases where there is no partner, showing appropriate states rather than empty or bugged partner placeholders.

### 3. Image Cropper Optimization
- **`src/components/profile-avatar.tsx`**:
    - Ensure the cropper is triggered for any avatar edit.
    - Verify that memory cleanup (`URL.revokeObjectURL`) is correctly implemented to prevent leaks.
- **`src/components/image-cropper-modal.tsx`**:
    - Refine the upload process to ensure the global state (React Query) is invalidated immediately after a successful upload, triggering a reactive update across all tabs.

### 4. Code Quality & Consistency
- Clean up redundant code in `layout-dashboard.tsx` that was manually handling profile updates.
- Standardize the use of the `useProfile` hook as the Single Source of Truth for identity data across the application.
