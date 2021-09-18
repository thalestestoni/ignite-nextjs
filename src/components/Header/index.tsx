import Image from 'next/image';

import styles from './header.module.scss';

export default function Header() {
  return (
    <>
       <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Image
            src="/images/logo.svg"
            alt="logo"
            height={27}
            width={239}
          />
        </div>
      </header>
    </>
  )
}
