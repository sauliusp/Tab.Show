# Source Code Structure

This directory contains all the shared business logic, components, and utilities for the TabGlance extension.

## Directory Structure

### `/components/`
Reusable React components that can be shared across different entry points:
- `Header.tsx` - Displays the original tab information
- `TabItem.tsx` - Renders individual tab items with visual states
- `TabList.tsx` - Renders the list of tabs

### `/services/`
Business logic services following the singleton pattern:
- `TabService.ts` - Handles all tab-related operations (querying, updating, etc.)

### `/hooks/`
Custom React hooks for state management:
- `useTabs.ts` - Manages tab state, events, and interactions

### `/types/`
TypeScript type definitions:
- `Tab.ts` - Tab interface and related types

### `/utils/`
Utility functions:
- `tabVisualState.ts` - Calculates visual states for tabs

### `/styles/`
Shared styling and theme configuration:
- `theme.ts` - MUI theme configuration with custom colors

### `/constants/`
Application constants and configuration values (ready for future use)

## Architecture Principles

1. **Separation of Concerns**: Entry points vs. business logic
2. **Singleton Services**: All services follow the singleton pattern
3. **Reusable Components**: Components can be shared across entry points
4. **Custom Hooks**: Complex state logic is encapsulated in hooks
5. **Type Safety**: Strong TypeScript typing throughout

## Benefits of This Structure

- **Maintainability**: Easier to find and modify specific functionality
- **Reusability**: Services and components can be shared across entry points
- **Testing**: Services and hooks can be unit tested independently
- **Scalability**: Easy to add new entry points (popup, options page, etc.)
- **WXT Compliance**: Follows WXT's recommended project structure

## Migration Notes

The refactoring moved code from a monolithic `App.tsx` (684 lines) to:
- Clean, focused components
- Reusable services
- Custom hooks for state management
- Proper separation of concerns

The main `App.tsx` is now only ~50 lines and focuses purely on composition and layout.
