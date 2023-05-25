import React from 'react';
import Button from '@components/frontStore/cms/Button';

export default function FeaturedCategories() {
  return (
    <div className="mt-15">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 page-width">
        <div>
          <div className="text-center">
            <img src="/assets/homepage/banner/1.jpg" alt="" />
          </div>
          <h3 className="h4 uppercase mt-1 mb-1">Jewellery</h3>
          <div className="mb-1">
            <p>
              Exclusive Collection Of Earrings, Pendants, Necklaces Bracelets And Many More.
            </p>
          </div>
          <Button url="/category/jewellery" title="Shop jewellery" variant="primary" />
        </div>
        <div>
          <div>
            <img src="/assets/homepage/banner/2.jpg" alt="" />
          </div>
          <h3 className="h4 uppercase mt-1 mb-1">Bags</h3>
          <div className="mb-1">
            <p>
            Exclusive Collection Of Hand Made Sling Bags And Many More.
            </p>
          </div>
          <Button url="/category/bags" title="Shop bags" variant="primary" />
        </div>
        <div>
          <div>
            <img src="/assets/homepage/banner/3.jpg" alt="" />
          </div>
          <h3 className="h4 uppercase mt-1 mb-1">Footwear</h3>
          <div className="mb-1">
            <p>
            Exclusively Designed Heels, Flats, Slippers, Boots And Many More. 
            </p>
          </div>
          <Button url="/category/footwear" title="Shop footwear" variant="primary" />
        </div>
      </div>
    </div>
  );
}

export const layout = {
  areaId: 'content',
  sortOrder: 10
};
