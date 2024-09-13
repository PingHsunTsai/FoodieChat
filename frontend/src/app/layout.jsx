import "./globals.css";
import { styles } from '../style';

export const metadata = {
  title: "LetsChat",
  description: "AI-Powered Networking",
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
