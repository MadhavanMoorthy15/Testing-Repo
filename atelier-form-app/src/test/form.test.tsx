import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import App from '../App';
import { DRAFT_KEY } from '../lib/draft';

describe('commission request form', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('starts on the first step', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { name: 'Who are we building for?' }),
    ).toBeInTheDocument();
  });

  it('blocks advancing when a required field is empty and shows the error', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByRole('heading', { name: 'Who are we building for?' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Enter the name we should address you by.'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('error-summary')).toBeInTheDocument();
  });

  it('clears the error once the field is corrected', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /continue/i }));
    expect(
      screen.getByText('Enter the name we should address you by.'),
    ).toBeInTheDocument();

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');

    await waitFor(() => {
      expect(
        screen.queryByText('Enter the name we should address you by.'),
      ).not.toBeInTheDocument();
    });
  });

  it('advances to the next step once the required fields are filled in', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');
    await user.type(screen.getByLabelText(/email address/i), 'eleanor@example.com');
    await user.click(screen.getByRole('radio', { name: 'Email' }));

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByRole('heading', { name: 'Tell us about the project' }),
    ).toBeInTheDocument();
  });

  it('rejects an invalid email address', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');
    await user.type(screen.getByLabelText(/email address/i), 'not-an-email');
    await user.click(screen.getByRole('radio', { name: 'Email' }));

    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(
      screen.getByText('Enter a valid email address, such as you@example.com.'),
    ).toBeInTheDocument();
  });

  it('reaches the review step and summarises the answers', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');
    await user.type(screen.getByLabelText(/email address/i), 'eleanor@example.com');
    await user.click(screen.getByRole('radio', { name: 'Email' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/type of work/i), 'kitchen');
    await user.type(screen.getByLabelText(/room or location/i), 'Kitchen, ground floor');
    await user.selectOptions(screen.getByLabelText(/budget band/i), '15k-40k');
    await user.type(screen.getByLabelText(/target completion/i), 'Spring 2027');
    await user.type(
      screen.getByLabelText(/project brief/i),
      'A peninsula run with a concealed pantry and open shelving above the hob.',
    );
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/timber species/i), 'oak');
    await user.click(screen.getByRole('radio', { name: 'Hardwax oil' }));
    await user.type(screen.getByLabelText(/longest run or panel width/i), '2400');
    await user.type(screen.getByLabelText(/number of units/i), '3');
    await user.click(screen.getByRole('radio', { name: 'Solid timber' }));
    await user.click(screen.getByRole('checkbox', { name: 'Concealed storage' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    expect(screen.getByRole('heading', { name: 'Review your request' })).toBeInTheDocument();

    // The summary carries the answers given in the earlier steps.
    expect(screen.getByText('Eleanor Whitfield')).toBeInTheDocument();
    expect(screen.getByText('Kitchen cabinetry')).toBeInTheDocument();
    expect(screen.getByText('English oak')).toBeInTheDocument();
    expect(screen.getByText('Concealed storage')).toBeInTheDocument();

    // A field left empty is marked explicitly.
    expect(screen.getByText('Not provided')).toBeInTheDocument();
  });

  it('requires consent before the request can be sent', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');
    await user.type(screen.getByLabelText(/email address/i), 'eleanor@example.com');
    await user.click(screen.getByRole('radio', { name: 'Email' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/type of work/i), 'kitchen');
    await user.type(screen.getByLabelText(/room or location/i), 'Kitchen');
    await user.selectOptions(screen.getByLabelText(/budget band/i), '15k-40k');
    await user.type(screen.getByLabelText(/target completion/i), 'Spring 2027');
    await user.type(screen.getByLabelText(/project brief/i), 'A peninsula run with concealed pantry.');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/timber species/i), 'oak');
    await user.click(screen.getByRole('radio', { name: 'Hardwax oil' }));
    await user.type(screen.getByLabelText(/longest run or panel width/i), '2400');
    await user.type(screen.getByLabelText(/number of units/i), '3');
    await user.click(screen.getByRole('radio', { name: 'Solid timber' }));
    await user.click(screen.getByRole('checkbox', { name: 'Concealed storage' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.click(screen.getByRole('button', { name: /send request/i }));

    expect(
      screen.getByText('Confirm the acknowledgement before sending your request.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /your request is with the studio/i }),
    ).not.toBeInTheDocument();
  });

  it('shows a confirmation with a reference once the request is sent', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');
    await user.type(screen.getByLabelText(/email address/i), 'eleanor@example.com');
    await user.click(screen.getByRole('radio', { name: 'Email' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/type of work/i), 'kitchen');
    await user.type(screen.getByLabelText(/room or location/i), 'Kitchen');
    await user.selectOptions(screen.getByLabelText(/budget band/i), '15k-40k');
    await user.type(screen.getByLabelText(/target completion/i), 'Spring 2027');
    await user.type(screen.getByLabelText(/project brief/i), 'A peninsula run with concealed pantry.');
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.selectOptions(screen.getByLabelText(/timber species/i), 'oak');
    await user.click(screen.getByRole('radio', { name: 'Hardwax oil' }));
    await user.type(screen.getByLabelText(/longest run or panel width/i), '2400');
    await user.type(screen.getByLabelText(/number of units/i), '3');
    await user.click(screen.getByRole('radio', { name: 'Solid timber' }));
    await user.click(screen.getByRole('checkbox', { name: 'Concealed storage' }));
    await user.click(screen.getByRole('button', { name: /continue/i }));

    await user.click(screen.getByLabelText(/i understand this is an enquiry/i));
    await user.click(screen.getByRole('button', { name: /send request/i }));

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /your request is with the studio/i }),
      ).toBeInTheDocument();
    });

    expect(screen.getByText(/CR-\d{6}-\d{4}/)).toBeInTheDocument();
  });

  it('saves a draft and offers to restore it', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<App />);

    await user.type(screen.getByLabelText(/full name/i), 'Eleanor Whitfield');

    await waitFor(() => {
      expect(window.localStorage.getItem(DRAFT_KEY)).not.toBeNull();
    });

    unmount();
    render(<App />);

    expect(screen.getByText(/we found a saved draft/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /continue draft/i }));

    await waitFor(() => {
      expect(screen.getByLabelText(/full name/i)).toHaveValue('Eleanor Whitfield');
    });
  });
});
