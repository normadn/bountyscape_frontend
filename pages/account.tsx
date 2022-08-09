import type { NextPage } from 'next';
import styles from '../styles/Home.module.css';
import { GrantRoleEmployer } from '../components/scFunctions/write/grantRoleEmployer';
import { RevokeRoleEmployer } from '../components/scFunctions/write/revokeRoleEmployer';
import { GrantRoleContractor } from '../components/scFunctions/write/grantRoleContractor';
import { RevokeRoleContractor } from '../components/scFunctions/write/revokeRoleContractor';

const Account: NextPage = () => {

  return (
    <>
      <main className={styles.main}>
    
        <GrantRoleEmployer />
        <br/>
        <RevokeRoleEmployer />
        <br/>
        <GrantRoleContractor />
        <br/>
        <RevokeRoleContractor />

      </main>
    </>
  );
};

export default Account;