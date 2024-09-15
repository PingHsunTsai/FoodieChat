import "./globals.css";
import { styles } from '../style';

export const metadata = {
  title: "FoodieChat",
  description: "Connect to worldwild foodies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${styles.padding} max-w-7xl mx-auto relative`}>
        {children}
      </body>
    </html>
  );
}
