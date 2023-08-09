import React from "react";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

const SkeletonCard = ({value}) => {
    return (
      <section>
        <ul className="list">
          {Array(value)
            .fill()
            .map((item, index) => (
            <li className="flex items-start py-4 cursor-pointer" key={index}>
            <div className="avatar placeholder mr-[0.625rem] flex-[0_0_2.25rem]">
              <div className="text-neutral-content rounded-full w-9"
              >
                <span className="text-lg font-medium text-white">
                <Skeleton circle={true} height={50} width={50} />
                
                </span>
              </div>
            </div>
            <div>

                  <span className="text-[0.8125rem] font-medium flex">
                    <Skeleton  width="8rem"/>
                    <Skeleton  width="4rem" className="ml-2"/>
                    <Skeleton  width="4rem" className="ml-2"/>
                  </span>
                  
                  <p className="text-[0.8125rem] text-[#8790AF] font-normal mt-[0.625rem] !mb-0 !leading-none" 
                    >
                         <Skeleton  height={15} width={`220%`}/>
                  </p>
                  <p className="text-[0.8125rem] text-[#8790AF] font-normal mt-[0.625rem] !mb-0 !leading-none" 
                    >
                         <Skeleton  height={15} width={`220%`}/>
                  </p>
            
            </div>
          </li>
            ))}
        </ul>
      </section>
    );
  };

  export default SkeletonCard;