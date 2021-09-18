import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header() {
  return (
    <>
       <header className={styles.headerContainer}>
        <div className={styles.headerContent}>
          <Link href='/'>
            <a>
              <Image
                src="/images/logo.svg"
                alt="logo"
                height={27}
                width={239}
              />
            </a>
          </Link>
        </div>
      </header>
    </>
  )
}
