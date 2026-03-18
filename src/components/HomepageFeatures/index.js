import React from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Zero-Installation Learning',
    emoji: '🚀',
    description: (
      <>
        Start coding in seconds. Our built-in Python engine allows you to 
        run scripts directly in your browser during the foundation phase.
      </>
    ),
  },
  {
    title: 'The Open-Source Ledger',
    emoji: '📖',
    description: (
      <>
        A curriculum that breathes. Since it lives on GitHub, anyone can 
        contribute, fix bugs, or add new projects to the roadmap.
      </>
    ),
  },
  {
    title: 'Project-First Mastery',
    emoji: '🛠️',
    description: (
      <>
        Don't just watch videos. Build real tools, from text-based RPGs 
        to data dashboards, moving from the browser to local development.
      </>
    ),
  },
];

function Feature({emoji, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <span style={{ fontSize: '5rem' }} role="img" aria-label={title}>
          {emoji}
        </span>
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}