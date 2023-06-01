import React from 'react';
import { GestureResponderEvent, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';

type Props = {
	title: string
	subtitle?: string;
	actionTitle?: string;
	onPressAction?: (e: GestureResponderEvent) => void;
};

export const EmptyStateView: React.FC<Props> = ({title, subtitle, actionTitle, onPressAction}) => {
	return <EmptyStateContainerView>
		<TitleText>
			{title}
		</TitleText>
		{typeof subtitle !== 'undefined' ? 
			<SubtitleText>
				{subtitle}
			</SubtitleText>:
			null
		}
		{typeof actionTitle !== 'undefined' ?
			<TouchableOpacity onPress={onPressAction}>
				<ButtonContainerView>
					<ButtonText>
						{actionTitle}
					</ButtonText>
				</ButtonContainerView>
			</TouchableOpacity>:
			null
		}
	</EmptyStateContainerView>;
};

const EmptyStateContainerView = styled.View`
	flex: 1;
	align-items: center;
	justify-content: center;
	padding-horizontal: 57px;
`;

const TitleText = styled.Text`
	font-size: 21px;
	line-height: 26px;
	font-weight: bold;
`;

const SubtitleText = styled.Text`
	text-align: center;
	padding-vertical: 10px;
	font-size: 15px;
	line-height: 20px;
`;

const ButtonContainerView = styled.View`
	margin-vertical: 30px;
	padding-vertical: 12px;
	padding-horizontal: 22px;
	border-width: 1px;
	border-color: #0046FF;
	border-radius: 8px;
`;

const ButtonText = styled.Text`
	font-size: 14px;
	line-height: 23px;
	font-weight: bold;
	color: #0046FF;
`;