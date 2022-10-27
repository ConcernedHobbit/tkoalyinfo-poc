import { Box, Chip } from "@mui/material";
import TickingChip from "components/TickingChip";
import {
  isWithinInterval,
  addHours,
  isToday,
  isTomorrow,
  format,
  isAfter,
  isBefore,
  isThisWeek,
  differenceInMilliseconds
} from "date-fns";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";

// TODO: Refactor this mess.
const RegistrationChip = ({ startDate, endDate, now }) => {
  const validRegistration = !!startDate && !!endDate;

  // We use states here to queue an update for them in the useEffect below.
  // Whether the event should have a countdown.
  const [hasCountdown, setHasCountdown] = useState(
    startDate &&
      isWithinInterval(startDate, {
        start: now,
        end: addHours(now, 2) // TODO: This could be moved into e.g. a config.
      })
  );
  // Whether this event can be registered for.
  const [canRegister, setCanRegister] = useState(
    startDate &&
      isAfter(now, startDate) &&
      (!endDate || (endDate && isBefore(now, endDate)))
  );

  // Start the countdown when there's 2 hours left
  // TODO: account for if registration is delayed after this kicks in
  useEffect(() => {
    if (startDate && isAfter(addHours(now, 2), startDate)) {
      const timeout = setTimeout(() => {
        setHasCountdown(true);
      }, differenceInMilliseconds(startDate, addHours(now, 2)));
      return () => clearTimeout(timeout);
    }
  }, [now, startDate]);

  // If the event has a countdown, clear it when it ends
  useEffect(() => {
    if (hasCountdown) {
      const timeout = setTimeout(() => {
        setHasCountdown(false);
        setCanRegister(true);
      }, differenceInMilliseconds(startDate, now));
      return () => clearTimeout(timeout);
    }
  }, [hasCountdown, setHasCountdown, now, startDate]);

  // Remove registation badge when registration is no longer valid
  useEffect(() => {
    if (canRegister) {
      const timeout = setTimeout(() => {
        setCanRegister(false);
      }, Math.min(differenceInMilliseconds(endDate, now), Math.pow(2, 31) - 1)); // If the end date is way in the future, we don't want to overflow
      return () => clearTimeout(timeout);
    }
  }, [canRegister, setCanRegister, now, endDate]);

  // If the registration period has ended or the event has no registration, don't show anything
  if (!validRegistration) return null;

  // The event has a countdown, show it with an animated chip
  if (hasCountdown) {
    return <TickingChip end={startDate} color="warning" prefix="📝 " />;
  }

  // The event has an active registration
  if (canRegister) {
    // But it ends today!
    if (endDate && isToday(endDate))
      return <Chip color="error" label={`📝 ${format(endDate, "HH:mm")}`} />;

    return <Chip color="success" label="📝" />;
  }

  // The event has a valid registration period but it is not yet open or in countdown
  return (
    <Chip color="info" label={`📝 ${format(startDate, "dd.MM. HH:mm")}`} />
  );
};

const DateChip = ({ startDate, subtitle, now }) => {
  if (isToday(startDate) || isTomorrow(startDate)) {
    return <Chip color="default" label={format(startDate, "HH:mm")} />;
  }

  if (isThisWeek(startDate)) {
    return <Chip color="default" label={format(startDate, "EEEE HH:mm")} />;
  }

  return <Chip color="default" label={format(startDate, "dd.MM.")} />;
};

const EventChips = ({ event, subtitle }) => {
  const { starts, registration_starts, registration_ends } = event;
  const now = new Date();
  const startDate = new Date(starts);
  const regStartDate = registration_starts && new Date(registration_starts);
  const regEndDate = registration_ends && new Date(registration_ends);

  return (
    <Box sx={{ display: "flex", gap: "1ch" }}>
      <RegistrationChip
        startDate={regStartDate}
        endDate={regEndDate}
        now={now}
      />
      <DateChip startDate={startDate} subtitle={subtitle} now={now} />
    </Box>
  );
};

export default EventChips;
