import React from 'react';
import bluedownicon from '../../../../../assets/images/icons/blue-chevron-down-icon.svg';
import previcon from '../../../../../assets/images/icons/table-grey-prev-icon.svg';
import nexticon from '../../../../../assets/images/icons/table-grey-next-icon.svg';
import soliddownicon from '../../../../../assets/images/icons/grey-solid-down-icon.svg';

const NotificationTable = () => {
  return (
    <>
      <div className="m-card p-5">
        <form action="">
          <div className="m-card-search mb-4">
            <div className="flex gap-5 items-center">
              <div className="w-auto">
                <label htmlFor="search-form" className="m-card-input-label">
                  Search:
                </label>
              </div>
              <div className="w-full">
                <input type="text" id="search-form" className="form-control" />
              </div>
            </div>
            <div className="flex justify-end">
              <button className="advance-filter-btn">
                Advance Search <img src={bluedownicon} alt="" />
              </button>
            </div>
          </div>
        </form>
        <div className="m-card-table">
          <div className="c-table overflow-auto">
            <div className="overflow-visible">
              <table className="table w-full">
                <thead>
                  <tr>
                    <th className="w-2/12">Date</th>
                    <th>Details</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero.{' '}
                      <a
                        href="#"
                        className="text-blue-600 underline hover:text-black"
                      >
                        Join Now
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero.{' '}
                      <a
                        href="#payment"
                        className="text-blue-600 underline hover:text-black"
                      >
                        Pay Now
                      </a>
                    </td>
                  </tr>
                  <tr className="bg-[#EBF4FD]">
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero. Sed vitae
                    </td>
                  </tr>
                  <tr>
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero.{' '}
                      <a
                        href="#payment"
                        className="text-blue-600 underline hover:text-black"
                      >
                        Pay Now
                      </a>
                    </td>
                  </tr>
                  <tr className="bg-[#EBF4FD]">
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero. Sed vitae
                    </td>
                  </tr>
                  <tr className="bg-[#EBF4FD]">
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero. Sed vitae
                    </td>
                  </tr>
                  <tr className="bg-[#EBF4FD]">
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero. Sed vitae
                    </td>
                  </tr>
                  <tr className="bg-[#EBF4FD]">
                    <td>17-04-2023</td>
                    <td className="whitespace-normal">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      Duis mattis dapibus feugiat. Phasellus eu purus felis.
                      Proin non volutpat libero. Sed vitae
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="table-meta-wrap">
        <div className="meta-row-count">
          <span className="meta-label">Rows per page:</span>
          <div className="select-dropdown">
            <button
              href="#"
              role="button"
              data-value=""
              className="select-dropdown__button"
            >
              <span>8 </span>
              <img src={soliddownicon} className="i-chevron-down" alt="" />
            </button>
            <ul className="select-dropdown__list">
              <li data-value="1" className="select-dropdown__list-item">
                8
              </li>
              <li data-value="2" className="select-dropdown__list-item">
                50
              </li>
              <li data-value="3" className="select-dropdown__list-item">
                100
              </li>
            </ul>
          </div>
        </div>
        <div className="table-pagination">
          <span className="table-pagination-text">1-8 of 1240</span>
          <a href="#" className="table-pagination-prev">
            <img src={previcon} alt="" />
          </a>
          <a href="#" className="table-pagination-next">
            <img src={nexticon} alt="" />
          </a>
        </div>
      </div>
    </>
  );
};

export default NotificationTable;
