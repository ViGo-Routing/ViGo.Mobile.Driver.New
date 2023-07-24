import { NavigationContainer } from "@react-navigation/native";
import Navigation from "./src/components/Navigation";
import { UserProvider } from "./src/context/UserContext";

export default function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <Navigation />
      </NavigationContainer>
    </UserProvider>
  );
}
