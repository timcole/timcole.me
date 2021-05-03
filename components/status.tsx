import { FC } from 'react';
import styled from 'styled-components';
import { useLanyard } from './lanyard';

const statuses = {
  online: ['#42b480', 'Online'],
  idle: ['#faa61a', 'Away'],
  dnd: ['#f04747', 'Busy'],
  offline: ['#747f8d', 'Offline'],
};

const Status: FC = () => {
  const doing = useLanyard();

  if (!doing || !statuses[doing.discord_status]) return <></>;

  return (
    <Orb color={statuses[doing.discord_status][0]}>
      <p>
        {statuses[doing.discord_status][1]} {doing.active_on_discord_mobile ? 'on mobile' : ''}
      </p>
    </Orb>
  );
};

export default Status;

const Orb = styled.div<{ color: string }>`
  p {
    display: flex;
    margin: 0 0 0 -15px;
    background: var(--background);
    position: absolute;
    bottom: -12px;
    left: 15px;
    height: 25px;
    line-height: 25px;
    padding-left: 18px;
    padding-right: 8px;
    align-items: center;
    font-size: 0.85em;

    &:before {
      width: 20px;
      height: 20px;
      border: 4px solid var(--background);
      background: ${(props) => props.color};
      border-radius: 50%;
      position: absolute;
      left: -13px;
      content: '';
    }
  }
`;
