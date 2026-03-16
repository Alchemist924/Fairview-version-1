import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import Home from "./pages/Home";
import PropertyOwners from "./pages/PropertyOwners";
import BuyersRenters from "./pages/BuyersRenters";
import PropertyListingPage from "./pages/PropertyListingPage";
import FAQs from "./pages/FAQs";
import About from "./pages/About";
import Login from "./pages/Login";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/property-owners" component={PropertyOwners} />
      <Route path="/buyers-renters" component={BuyersRenters} />
      
      <Route path="/lands-for-sale">
        {() => (
          <PropertyListingPage 
            title="Lands for Sale" 
            intro="Secure prime plots across Nigeria's fastest-growing locations. All lands listed here have been physically verified by our team."
            category="land"
          />
        )}
      </Route>
      
      <Route path="/properties-for-sale">
        {() => (
          <PropertyListingPage 
            title="Properties for Sale" 
            intro="Find your dream home or next investment. Browse verified residential and commercial properties ready for transfer."
            category="property"
          />
        )}
      </Route>
      
      <Route path="/apartments-for-rent">
        {() => (
          <PropertyListingPage 
            title="Apartments for Rent" 
            intro="Discover beautifully finished, secure apartments tailored to your budget and lifestyle."
            category="apartment"
            showReviews={true}
          />
        )}
      </Route>
      
      <Route path="/shops-for-lease">
        {() => (
          <PropertyListingPage 
            title="Shops & Retail for Lease" 
            intro="Position your business for growth with premium commercial spaces in high-traffic areas."
            category="shop"
            showReviews={true}
          />
        )}
      </Route>

      <Route path="/faqs" component={FAQs} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
