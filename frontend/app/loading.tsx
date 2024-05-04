import Header from '@/components/header/header';
import Menu from '@/components/menu/menu';
import MobileMenu from '@/components/mobilemenu/mobilemenu';

export default function Loading() {
  return (
    <>
      <div className="body">
        <div className="body_left">
          <Menu />
        </div>
        <div className="body_right">
          <Header />
          <main>
            <div>Loading</div>
          </main>
        </div>
      </div>
      <div className="body_mobile">
        <main>
          <MobileMenu />
          <div>Loading</div>
        </main>
      </div>
    </>
  );
}
