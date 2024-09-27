import { FC, useState } from "react";
import { Job } from "../../services/jobs";
import { Calendar, momentLocalizer, Event, SlotInfo } from "react-big-calendar";
import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import { CalendarWrapper } from "./WeeklyJobs.style";
import { useNavigate } from "react-router-dom";
import { CreateJobModal } from "../CreateJobModal/CreateJobModal";

type WeeklyJobsProps = {
  startDate: string;
  onChangeStartDate: (startDate: string) => void;
  jobs: Job[];
  onJobCreated?: () => void;
};

export const WeeklyJobs: FC<WeeklyJobsProps> = ({
  startDate,
  onChangeStartDate,
  jobs,
  onJobCreated,
}) => {
  const navigate = useNavigate();
  const [jobCreationTime, setJobCreationTime] = useState<{
    date: Dayjs;
    startTime: Dayjs;
    endTime: Dayjs;
  } | null>(null);

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

  const calendarClickHander = (slotInfo: SlotInfo) => {
    setJobCreationTime({
      startTime: dayjs(slotInfo.start),
      endTime: dayjs(slotInfo.end),
      date: dayjs(slotInfo.start),
    });
  };

  const closeModalHandler = () => {
    setJobCreationTime(null);
    onJobCreated?.();
  };

  const events: Event[] = jobs.map((job) => ({
    resource: job.id,
    title: job.name,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));
  const endDate = dayjs(startDate).add(6, "day").format("YYYY-MM-DD");
  return (
    <>
      <CalendarWrapper>
        <Calendar
          localizer={localizer}
          events={events}
          defaultView="week"
          views={["week"]}
          date={startDate}
          onNavigate={navigateHandler}
          step={60}
          dayLayoutAlgorithm="no-overlap"
          min={new Date(`${startDate} 8:00`)}
          max={new Date(`${endDate} 20:00`)}
          onSelectEvent={eventClickHandler}
          onSelectSlot={calendarClickHander}
          selectable
        />
      </CalendarWrapper>
      {jobCreationTime && (
        <CreateJobModal
          onClose={closeModalHandler}
          initialValues={jobCreationTime}
        />
      )}
    </>
  );
};
