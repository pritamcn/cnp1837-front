import React from 'react';
import Header from '@/components/module/common/client/Header';
import Footer from '@/components/module/common/client/Footer';
import MemberShip from '@/components/module/visitor/home/ServerComponent/MemberShip';
import Whatwedo from '@/components/module/visitor/home/ServerComponent/Whatwedo';
import Services from '@/components/module/visitor/home/ServerComponent/Services';
import GetTouch from '@/components/module/visitor/home/ServerComponent/GetTouch';
import Engage from '@/components/module/visitor/home/ClientComponent/Engage';
import DefendingRights from '@/components/module/visitor/home/ClientComponent/DefendingRights';
import Subscription from '@/components/module/visitor/home/ServerComponent/Subscription';
import { baseURL } from '@/config';
export async function getdata() {
  const res = await fetch(`${baseURL}/home/getAllHomeContent`,{ next: { revalidate: 1 } });
    const data = await res.json();
    return {
      data,
    };
}
const HomePage = async() => {
  const {data}=await getdata();
  return (
    <div className="App">
      <Header />
      <div className="home-main">
        <MemberShip banner={data?.data?.home_banner?.image} content={data?.data?.home_page_content[3]}/>
        <Whatwedo content={data?.data?.home_page_content[0]}/>
        <Services value={data?.data?.services_list} content={data?.data?.home_page_content[5]} />
        <GetTouch value={data?.data?.home_page_content[4]}/>
        <Engage value={data?.data}/>
        <DefendingRights value={data?.data?.home_page_content[2]}/>
        {/* <Subscription /> */}
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
