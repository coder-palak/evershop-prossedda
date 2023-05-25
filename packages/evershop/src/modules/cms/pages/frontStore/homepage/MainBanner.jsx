import React from 'react';
import { _ } from '@evershop/evershop/src/lib/locale/translate';
import './MainBanner.scss';

export default function MainBanner() {
  const text = _('Get Minimum ${discount} Off', {
    discount: '10%',
    price: '999'
  });
  return (
    <div className="main-banner-home flex items-center">
      <div className="container grid grid-cols-1 md:grid-cols-2">
        <div />
        <div className="text-center md:text-left px-2 ">
          <h2 className="h1 ">{text}</h2>
          <p>
            Use coupon code
            <span className="font-bold">&nbsp;MIN499</span>
          </p>
          {/* <p>{_('Use coupon ${coupon}', { coupon: 'DISCOUNT15' })}</p> */}
          <p></p>
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 1
};
