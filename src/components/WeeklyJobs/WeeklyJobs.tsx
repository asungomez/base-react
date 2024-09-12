import { FC } from "react";
import { Job } from "../../services/jobs";
import { Calendar, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import dayjs from "dayjs";
import { CalendarWrapper } from "./WeeklyJobs.style";
import { useNavigate } from "react-router-dom";

type WeeklyJobsProps = {
  initialStartDate: string;
  onChangeStartDate: (startDate: string) => void;
  jobs: Job[];
};

export const WeeklyJobs: FC<WeeklyJobsProps> = ({
  initialStartDate,
  onChangeStartDate,
  jobs,
}) => {
  const navigate = useNavigate();
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });
  const localizer = momentLocalizer(moment);

  const navigateHandler = (newDate: Date) => {
    onChangeStartDate(dayjs(newDate).format("YYYY-MM-DD"));
  };

  const eventClickHandler = (event: Event) => {
    navigate(`/jobs/${event.resource as string}`);
  };

  const events: Event[] = jobs.map((job) => ({
    resource: job.id,
    title: job.name,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));
  const endDate = dayjs(initialStartDate).add(6, "day").format("YYYY-MM-DD");
  return (
    <CalendarWrapper>
      <Calendar
        localizer={localizer}
        events={events}
        view="week"
        views={["week"]}
        date={initialStartDate}
        onNavigate={navigateHandler}
        step={60}
        dayLayoutAlgorithm="no-overlap"
        min={new Date(`${initialStartDate} 8:00`)}
        max={new Date(`${endDate} 20:00`)}
        onSelectEvent={eventClickHandler}
      />
    </CalendarWrapper>
  );
};
