"use client";

import HomeCard from "@/components/HomeCard";
import MeetingModal from "@/components/MeetingModal";
import { useUser } from "@clerk/nextjs";
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useRouter } from "next/navigation";
import { useState } from "react";

const MeetingTypeList = () => {
	const [meetingState, setMeetingState] = useState<
		"isScheduleMeeting" | "isJoiningMeeting" | "isInstantMeeting" | undefined
	>();
	const router = useRouter();
	const { user } = useUser();
	const client = useStreamVideoClient();
	const [values, setValues] = useState({
		dateTime: new Date(),
		description: "",
		link: "",
	});
	const [callDetil, setCallDetail] = useState<Call>();

	const createMeeting = async () => {
		if (!client || !user) {
			return;
		}

		try {
			const id = crypto.randomUUID();
			const call = client.call("default", id);
			const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
			const description = values.description || "Instant Meeting";

			await call.getOrCreate({
				data: {
					starts_at: startsAt,
					custom: {
						description,
					},
				},
			});

			setCallDetail(call);

			if (!values.description) {
				router.push(`/meeting/${call.id}`);
			}
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
			<HomeCard
				img="/icons/add-meeting.svg"
				title="New Meeting"
				description="Start an instant meeting"
				className="bg-orange-1"
				handleClick={() => setMeetingState("isInstantMeeting")}
			/>
			<HomeCard
				img="/icons/join-meeting.svg"
				title="Join Meeting"
				description="via invitation link"
				className="bg-blue-1"
				handleClick={() => setMeetingState("isJoiningMeeting")}
			/>
			<HomeCard
				img="/icons/schedule.svg"
				title="Schedule Meeting"
				description="Plan your meeting"
				className="bg-purple-1"
				handleClick={() => setMeetingState("isScheduleMeeting")}
			/>
			<HomeCard
				img="/icons/recordings.svg"
				title="View Recordings"
				description="Meeting Recordings"
				className="bg-yellow-1"
				handleClick={() => router.push("/recordings")}
			/>
			<MeetingModal
				isOpen={meetingState === "isInstantMeeting"}
				onClose={() => setMeetingState(undefined)}
				title="Start an Instant Meeting"
				className="text-center"
				buttonText="Start Meeting"
				handleClick={createMeeting}
			/>
		</section>
	);
};

export default MeetingTypeList;
