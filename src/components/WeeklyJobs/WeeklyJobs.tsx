import { ComponentType, FC, useState } from "react";
import { Job } from "../../services/jobs";
import {
  Calendar,
  CalendarProps,
  Event,
  SlotInfo,
  momentLocalizer,
} from "react-big-calendar";
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

const CalendarComponent = Calendar as ComponentType<
  CalendarProps<Event, object>
>;

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
    navigate(`/jobs/${event.resource.id as string}`);
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
    resource: { id: job.id, color: job.assignedTo?.color },
    title: job.name,
    start: new Date(`${job.date} ${job.startTime}`),
    end: new Date(`${job.date} ${job.endTime}`),
  }));
  const endDate = dayjs(startDate).add(6, "day").format("YYYY-MM-DD");

  const eventProps = (event: Event) => {
    if (event.resource?.color) {
      return {
        style: {
          backgroundColor: event.resource.color,
        },
      };
    }
    return {};
  };

  return (
    <>
      <CalendarWrapper>
        <CalendarComponent
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
          eventPropGetter={eventProps}
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
