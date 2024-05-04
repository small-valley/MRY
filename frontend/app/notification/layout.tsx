import Header from '@/components/header/header';
import Menu from '@/components/menu/menu';
import MobileMenu from '@/components/mobilemenu/mobilemenu';

export default function NotificationLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="body">
        <div className="body_left">
          <Menu />
        </div>
        <div className="body_right">
          <Header />
          <main>{children}</main>
        </div>
      </div>
      <div className="body_mobile">
        <main>
          <MobileMenu />
          {children}
        </main>
      </div>
    </>
  );
}
