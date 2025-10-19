# Architecture Documentation

> **📚 Part of UddoktaHut Documentation Suite**  
> **← [README](./README.md)** | **[API Docs](./API.md)** | **[Testing Guide](./TESTING.md) →**

## 🏗️ System Architecture Overview

UddoktaHut follows a modern, component-based architecture with clear separation of concerns.

## 🎯 Design Principles

### **1. Server-First Architecture**

- **SSR by Default**: Components are server-rendered unless client interactivity is required
- **Client Chunks**: Strategic use of "use client" for interactive components
- **Performance**: Optimized bundle sizes and faster initial page loads

### **2. Template System Architecture**

```
Template Registry (Centralized)
├── Template Metadata (constants/templates.js)
├── Template Components (components/shopui/templates/)
└── Template Selection (components/dashboard/settings/)
```

**Key Components:**

- **`TemplateRegistry.jsx`**: Central registry for all templates
- **`constants/templates.js`**: Template IDs, metadata, and configuration
- **`TemplateManagement.jsx`**: Template selection interface
- **`TemplateAwareStorePage.jsx`**: Dynamic template rendering

### **3. State Management Strategy**

```
Global State
├── UserContext (User data, authentication state)
├── React Query (Server state, caching)
└── Component State (Local UI state)
```

**State Flow:**

1. **Server State**: Managed by TanStack Query
2. **User State**: React Context for authentication
3. **UI State**: Local useState for component-specific state

### **4. API Integration Pattern**

```
Component → React Query Hook → API Action → Backend
```

**Example Flow:**

```javascript
TemplateManagement → useUpdateTemplate → updateStoreTemplate → Backend API
```

## 🧩 Component Architecture

### **Component Hierarchy**

```
App Layout
├── UserProvider (Authentication context)
├── ReactQueryProvider (Data fetching context)
├── ThemeProvider (Theme context)
└── Page Components
    ├── Dashboard Components
    ├── Store Components
    └── Common Components
```

### **Component Categories**

**1. Page Components** (`app/`)

- Route-level components
- Data fetching coordination
- Layout composition

**2. Feature Components** (`components/dashboard/`, `components/shopui/`)

- Business logic implementation
- Feature-specific functionality
- Domain-bounded components

**3. Common Components** (`components/common/`)

- Reusable across features
- Generic functionality
- Shared utilities

**4. UI Components** (`components/ui/`)

- Pure presentation components
- No business logic
- Design system components

## 🔄 Data Flow Architecture

### **Template Update Flow**

1. User selects template in UI
2. `TemplateManagement` calls `useUpdateTemplate` hook
3. Hook triggers `updateStoreTemplate` API action
4. API call updates backend
5. React Query invalidates cache
6. UI updates with new template
7. Toast notification confirms success

### **Authentication Flow**

1. User logs in via `LoginForm`
2. JWT tokens stored in HTTP-only cookies
3. `UserContext` provides user state
4. Middleware protects routes
5. API calls include authentication headers

## 🎨 Template System Design

### **Template Registration**

```javascript
// constants/templates.js
export const TEMPLATE_IDS = {
  CLASSIC: "classic",
  MODERN_DARK: "modernDark",
  BOUTIQUE: "boutique",
};

export const TEMPLATE_METADATA = {
  [TEMPLATE_IDS.CLASSIC]: {
    name: "Classic Store",
    description: "Traditional e-commerce layout",
    colors: {
      /* theme colors */
    },
    layout: {
      /* layout config */
    },
  },
};
```

### **Dynamic Template Loading**

```javascript
// components/common/TemplateRegistry.jsx
const TEMPLATE_REGISTRY = {
  [TEMPLATE_IDS.CLASSIC]: lazy(() =>
    import("../shopui/templates/classic/ClassicTemplate")
  ),
  [TEMPLATE_IDS.MODERN_DARK]: lazy(() =>
    import("../shopui/templates/modernDark/ModernDarkTemplate")
  ),
};
```

### **Template Rendering**

```javascript
// Server-side template resolution
const TemplateComponent = getTemplate(templateName);
return <TemplateComponent {...props} />;
```

## 📦 Folder Organization Strategy

### **Feature-Based Organization**

```
components/
├── dashboard/           # Dashboard-specific features
│   ├── settings/       # Settings domain
│   └── product-management/ # Product domain
├── shopui/             # Store UI features
│   ├── templates/      # Template implementations
│   └── layout/         # Store layout components
└── common/             # Shared across features
```

### **Co-location Principle**

- Related files are kept together
- Tests alongside components
- Types and utilities near usage

## 🔧 Technical Decisions

### **Why React Query?**

- **Caching**: Automatic background updates
- **Optimistic Updates**: Better UX
- **Error Handling**: Standardized error states
- **Loading States**: Built-in loading management

### **Why Server Components?**

- **Performance**: Faster initial loads
- **SEO**: Better search engine optimization
- **Bundle Size**: Reduced client-side JavaScript

### **Why Context for User State?**

- **Simplicity**: Minimal global state needs
- **Performance**: Infrequent updates
- **Type Safety**: Better than prop drilling

## 🧪 Testing Architecture

### **Testing Strategy**

```
Test Pyramid
├── Unit Tests (Components, Hooks)
├── Integration Tests (Feature flows)
└── E2E Tests (User journeys)
```

### **Test Utilities Structure**

- **`test-utils.js`**: Common testing helpers
- **Mock providers**: Consistent test environment
- **Custom render functions**: Provider wrapping
- **Mock data**: Realistic test scenarios

### **Mocking Strategy**

- **API Calls**: Mock with Jest
- **External Libraries**: Mock at module level
- **Components**: Mock complex children for focused testing

## 📈 Performance Considerations

### **Bundle Optimization**

- **Code Splitting**: Template lazy loading
- **Tree Shaking**: Minimal imports
- **Dynamic Imports**: Route-level splitting

### **Lazy Loading Strategy**

UddoktaHut implements a comprehensive lazy loading strategy using Next.js `dynamic()` imports to optimize bundle sizes and improve initial page load performance.

#### **Route-Level Lazy Loading**

```jsx
// Dashboard sections - only load when visiting specific routes
const ProductManagementSection = dynamic(() =>
  import("@/components/dashboard/product-management/ProductManagementSection")
);
const StoreAppearanceSettings = dynamic(() =>
  import("@/components/dashboard/settings/StoreAppearanceSettings")
);
const Stepper = dynamic(() => import("@/components/stepper/Stepper"));

// Authentication forms - only load when visiting auth pages
const LoginForm = dynamic(() => import("@/components/form/LoginForm"));
const RegistrationForm = dynamic(() =>
  import("@/components/form/RegistrationForm")
);

// Store components - only load for store pages
const TemplateAwareStorePage = dynamic(() =>
  import("@/components/shopui/TemplateAwareStorePage")
);
```

#### **Modal/Interaction-Based Lazy Loading**

```jsx
// Forms only load when modals open
const ProductForm = dynamic(() => import("@/components/form/ProductForm"));
const DataTable = dynamic(() => import("@/components/ui/data-table"));

// Modals only load when triggered
const FormModal = dynamic(() => import("@/components/common/FormModal"));
const ConfirmationModal = dynamic(() =>
  import("@/components/common/ConfirmationModal")
);
```

#### **Template System Lazy Loading**

```jsx
// Templates lazy load individually when selected
const ClassicTemplate = dynamic(() =>
  import("../shopui/templates/classic/ClassicTemplate")
);
const ModernDarkTemplate = dynamic(() =>
  import("../shopui/templates/modernDark/ModernDarkTemplate")
);
const BoutiqueTemplate = dynamic(() =>
  import("../shopui/templates/boutique/BoutiqueTemplate")
);
```

#### **Landing Page Strategy**

**✅ Immediately Loaded (Critical Path):**

- Header/Navigation (immediate access needed)
- Hero section (primary CTA)
- Features section (core value proposition)

**❌ Not Lazy Loaded:**

- Above-the-fold content (SEO + UX)
- Critical navigation elements
- Primary call-to-action components

#### **Performance Benefits**

- **Initial Bundle Reduction**: 30-50% smaller first load
- **Progressive Loading**: Components load as needed
- **Better Core Web Vitals**: Improved LCP and FID scores
- **Memory Efficiency**: Unused components not loaded
- **Network Optimization**: Reduced initial requests

#### **Loading States & UX**

All lazy-loaded components include skeleton loading states:

```jsx
const Component = dynamic(() => import("./Component"), {
  loading: () => <ComponentSkeleton />,
  ssr: true, // Maintain SSR for SEO when needed
});
```

**Skeleton Components:**

- `TemplateSkeleton` - For template previews
- `TableSkeleton` - For data tables
- Custom skeletons - Form fields, cards, sections

#### **SSR Considerations**

- **Server Components**: Use `ssr: true` (default) for SEO content
- **Client Components**: Can use `ssr: false` for interactive-only components
- **Hybrid Approach**: Strategic SSR based on content importance

#### **Bundle Analysis Results**

```
Route Performance (Production):
├── / (Landing)           114 kB  (Hero + Features direct)
├── /login               292 kB  (Form lazy loaded)
├── /dashboard           136 kB  (52% reduction!)
├── /dashboard/settings  132 kB  (Templates lazy loaded)
└── /onboarding         300 kB  (Stepper lazy loaded)
```

### **Rendering Optimization**

- **SSR**: Server-side rendering by default
- **Memoization**: Strategic React.memo usage
- **Query Optimization**: React Query caching

### **Loading Strategies**

- **Skeleton Loading**: Better perceived performance
- **Progressive Enhancement**: Core functionality first
- **Error Boundaries**: Graceful failure handling

## 🔒 Security Architecture

### **Authentication Security**

- **HTTP-only Cookies**: XSS protection
- **JWT Tokens**: Stateless authentication
- **Route Protection**: Middleware-based guards

### **API Security**

- **Input Validation**: Zod schemas
- **Error Handling**: No sensitive data leakage
- **CORS**: Proper origin restrictions

## 📊 Monitoring & Observability

### **Error Tracking**

- **Console Logging**: Development debugging
- **Toast Notifications**: User-friendly errors
- **Error Boundaries**: Component-level error catching

### **Performance Monitoring**

- **React Query DevTools**: Query inspection
- **Next.js Analytics**: Bundle analysis
- **Test Coverage**: Code quality metrics

## 🚀 Deployment Architecture

### **Build Process**

1. **Linting**: Code quality checks
2. **Testing**: Automated test execution
3. **Building**: Production optimization
4. **Static Generation**: Pre-rendered pages

### **Environment Strategy**

- **Development**: Full debugging capabilities
- **Staging**: Production-like testing
- **Production**: Optimized performance

This architecture enables:

- ✅ **Scalability**: Easy to add new templates and features
- ✅ **Maintainability**: Clear separation of concerns
- ✅ **Performance**: Optimized rendering and caching
- ✅ **Developer Experience**: Clear patterns and tooling
- ✅ **Testing**: Comprehensive test coverage
- ✅ **Documentation**: Self-documenting code structure
