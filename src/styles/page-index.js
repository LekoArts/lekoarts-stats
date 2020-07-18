import { css } from 'astroturf'

export const styles = css`
  .header {
    padding: var(--spacer-y) var(--spacer-x);
    border-bottom: 1px solid var(--color-gray-100);
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .title {
    margin: 0;
  }
  
  .heading {
    margin-bottom: 0;
    margin-top: 0;
  }
  
  .subheading {
    color: var(--color-gray-700);
  }

  .main {
    padding: var(--spacer-y-xl) var(--spacer-x);
    width: 100%;
  }

  .content {
    display: grid;
    grid-template-columns: 49% 49%;
    grid-gap: 2%;
  }

  @media screen and (max-width: 1024px) {
    .content {
      grid-template-columns: 100%;
    }
  }

  .lineContainer {
    width: 100%;
    height: calc(var(--chartHeight) * 1px);
  }

  .footer {
    padding: 1.5rem 2rem;
    font-size: 0.9rem;
    color: var(--color-gray-600);
    border-top: 1px solid var(--color-gray-100);
  }

  .spacer {
    padding: 2rem 0;
  }
`
