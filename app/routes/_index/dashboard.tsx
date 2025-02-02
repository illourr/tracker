import { SettingsIcon, TrendingDown, TrendingUp } from 'lucide-react';
import { type ReactNode } from 'react';

import { useLoaderData } from '@remix-run/react';

import { Button } from '~/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '~/components/ui/card';

import { PageHeader } from '~/components/page';
import { Score, ScoreToPar } from '~/components/score-display';
import { calculateScoreDifferential, cn, formatDate } from '~/utils';
import { type Loader } from './route';

export function Dashboard() {
	const { rounds } = useLoaderData<Loader>();

	return (
		<main>
			<PageHeader
				title="Dashboard"
				action={
					<Button variant="outline">
						<SettingsIcon className="opacity-60 mr-1 h-4 w-4" />
						Customize Dashboard
					</Button>
				}
			/>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-[2vw] p-10">
				<QuickStat
					title="Handicap"
					stat="5.2"
					trend="-0.8 since last month"
					trendDirection="positive"
					icon={<TrendingDown />}
				/>

				<QuickStat
					title="Fairways Hit"
					stat="68%"
					trend="+6% since last month"
					trendDirection="positive"
					icon={<TrendingUp />}
				/>
				<QuickStat
					title="Rounds Played"
					stat="6"
					trend="2 fewer than this time last month"
					trendDirection="negative"
					icon={<TrendingDown />}
				/>
				<QuickStat
					title="% Par or Better"
					stat="60%"
					trend="+5% since last month"
					trendDirection="positive"
					icon={<TrendingUp />}
				/>
				<div className="col-span-2">
					<DashboardCard
						title="Recent Rounds"
						description="Your latest 5 rounds"
					>
						{rounds.map(round => {
							return <RoundRow key={round.id} round={round} />;
						})}
					</DashboardCard>
				</div>
				<div className="col-span-2">
					<DashboardCard title="Score Distribution" description="Yep">
						Chart
					</DashboardCard>
				</div>
				<div className="col-span-2">
					<DashboardCard
						title="Short Game"
						description="Putts per round, up and downs, sand saves"
					>
						Chart
					</DashboardCard>
				</div>
				<div className="col-span-2">
					<DashboardCard title="Accuracy" description="Driving Accuracy, GIR">
						Chart
					</DashboardCard>
				</div>
				<div className="col-span-2">
					<DashboardCard
						title="Top Courses"
						description="Courses you've played the most i guess?"
					>
						Chart
					</DashboardCard>
				</div>
			</div>
		</main>
	);
}

interface QuickStatProps {
	title: string;
	stat: string;
	trend: string;
	icon: ReactNode;
	trendDirection: 'positive' | 'negative';
}

const QuickStat = ({
	title,
	stat,
	trend,
	icon,
	trendDirection,
}: QuickStatProps) => {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div
					className={cn('h-4 w-4 ', {
						'text-green-600': trendDirection === 'positive',
						'text-red-600': trendDirection === 'negative',
					})}
				>
					{icon}
				</div>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{stat}</div>
				<p className="text-xs text-muted-foreground">{trend}</p>
			</CardContent>
		</Card>
	);
};

interface DashboardCardProps {
	title: string;
	description: string;
	children: ReactNode;
}

const DashboardCard = ({
	title,
	description,
	children,
}: DashboardCardProps) => {
	return (
		<Card>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>
		</Card>
	);
};

const RoundRow = ({ round }: { round: any }) => {
	const score = {
		score: round.totalScore,
		par: round.course.par,
	};
	return (
		<div className="flex justify-between items-center py-2 [&:not(:first-child)]:border-t-2">
			<div>
				<div className="font-bold mb-1">
					{formatDate({ date: String(round.datePlayed) })}
				</div>
				<div className="text-muted-foreground text-xs">
					@{round.course.name}
				</div>
			</div>
			<div className="text-right">
				<div className="font-black flex align-baseline leading-none gap-1 mb-1">
					<Score {...score} />
					<ScoreToPar {...score} wrap className="text-sm" />
				</div>
				<div className="text-muted-foreground italic text-xs">
					Diff:{' '}
					{calculateScoreDifferential({
						score: round.totalScore,
						rating: round.tees.rating,
						slope: round.tees.slope,
					})}
				</div>
			</div>
		</div>
	);
};
