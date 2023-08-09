import Tabs from '@/components/module/user/CourtReporter/AccountSettings/Tabs';

export const metadata = {
  title: 'Court Reporter Account Setting',
  description: 'Generated by create next app',
};

export default async function PhysicianAccountSettingsLayout({ children }) {
  return (
    <div className="right-container !flex-[0_0_calc(100vw-21.5625rem)] max-w-[calc(100vw-21.5625rem)] !pb-0 min-h-[100vh]">
      <h2 className="c-page-title">Account Settings</h2>
      <div className="m-card">
        <div className="m-card-top">
          <Tabs />
        </div>
        {children}
      </div>
    </div>
  );
}
