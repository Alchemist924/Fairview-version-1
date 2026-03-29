import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";

import Home from "./pages/Home";
import PropertyOwners from "./pages/PropertyOwners";
import BuyersRenters from "./pages/BuyersRenters";
import PropertyListingPage from "./pages/PropertyListingPage";
import PropertyDetail from "./pages/PropertyDetail";
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
            intro={<>Secure verified plots of Land across Ife with confidence.<br />Looking for something specific?<br />Tap the WhatsApp icon below – we'll help you explore the best options.</>}
            filterCategory="land"
            filterListingType="sale"
          />
        )}
      </Route>

      <Route path="/properties-for-sale">
        {() => (
          <PropertyListingPage
            title="Properties for Sale"
            intro={<>Find your next home or investment with ease.<br />Browse verified residential and commercial properties in Ife, ready for transfer.<br />Need something specific?<br />Tap the WhatsApp icon below – we'll help you explore the right options.</>}
            filterListingType="sale"
          />
        )}
      </Route>

      <Route path="/apartments-for-rent">
        {() => (
          <PropertyListingPage
            title="Apartments for Rent"
            intro={<>Find a variety of available living spaces in Ile Ife, ready for you to move in.<br />Looking for something specific?<br />Tap the WhatsApp icon below – we'll help you explore the best options.</>}
            filterCategory="apartment"
            filterListingType="rent"
          />
        )}
      </Route>

      <Route path="/shops-for-lease">
        {() => (
          <PropertyListingPage
            title="Shops for Lease"
            intro={<>Check out available commercial spaces and shops in Ile Ife, for your type of business.<br />Need something specific?<br />Tap the WhatsApp icon below – we'll guide you to the right options.</>}
            filterCategory="shop"
            filterListingType="lease"
          />
        )}
      </Route>

      <Route path="/property/:slug" component={PropertyDetail} />

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
