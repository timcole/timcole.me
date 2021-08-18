import { FC } from 'react';
import Article from './article';

const Setup: FC = () => (
  <Article image="https://cdn.t.pics/setup.png" darker>
    <h2>Desk Setup</h2>
    <p>
      My desk is made from a normal butcher block countertop ontop of the{' '}
      <a
        href="https://www.autonomous.ai/standing-desks/diy-smart-desk-kit?option16=36&option17=41&rid=1ec031&utm_campaign=referrals&utm_source=referrals_copy&utm_medium=1ec031&utm_term=referrals_share"
        target="_blank"
      >
        Autonomous SmartDesk DIY Kit (Premium - White).
      </a>
    </p>
    <p>
      I also sit in the{' '}
      <a
        href="https://www.autonomous.ai/office-chairs/kinn-chair&rid=1ec031&utm_campaign=referrals&utm_source=referrals_copy&utm_medium=1ec031&utm_term=referrals_share"
        target="_blank"
      >
        Autonomous Kinn Chair
      </a>
    </p>
    <p>
      Find the tech on my{' '}
      <a
        href="https://www.amazon.com/ideas/amzn1.account.AGCTFSXJPHS6PNR5DH573SDR2GLA/1Q0UPDVESE0UE"
        target="_blank"
      >
        Amazon Page.
      </a>
    </p>
  </Article>
);

export default Setup;
