
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";
import ProfileCard from "../../components/cards/ProfileCard/ProfileCard";
import AppMenuItem from "../../components/menu/AppMenuItem";
import GlassIcons from "../../components/GlassIcons/GlassIcons";
import { MenuCard } from "../../components/menu/MenuCard";

export default function Ecommerce() {
  return (
    <>
      <PageMeta
        title="Main Menu | TailAdmin - React.js Admin Dashboard Template"
        description="This is React.js Ecommerce Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        

        <div className="col-span-12 xl:col-span-4">
            <ProfileCard
                name="Ichwan Riskhi"
                title="Software Engineer"
                handle="ichwanriskhi@gmail.com"
                status="Online"
                contactText="Logout"
                avatarUrl="./images/logo/Iki.png"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => console.log('Logout Clicked')}
            />
        </div>
        <div className="col-span-12 xl:col-span-8">
            <div className="grid grid-cols-3 gap-4">
                <MenuCard title="Files" description="Manage your files" color="purple" imageUrl="https://images.unsplash.com/photo-1758405341470-7e54014b1f4b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687"/>
                <MenuCard title="Books" description="Manage your books" color="blue" />
                <MenuCard title="Health" description="Manage your health" color="red" />
                <MenuCard title="Weather" description="Manage your weather" color="green" />
                <MenuCard title="Notes" description="Manage your notes" color="indigo" />
                <MenuCard title="Stats" description="Manage your stats" color="orange" />
            </div>
        </div>
      </div>
    </>
  );
}
